import time
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from utils.logger import setup_logger


class SQLiModule:
    """Enhanced SQLi module with error-based and time-based detection.

    - Measures baseline response time and text
    - For time-based payloads compares duration vs baseline + threshold
    - For error-based uses Analyzer utilities to find SQL error signatures
    """

    name = 'sqli'

    def __init__(self, payloads, analyzer, logger=None, time_threshold=3.0):
        self.payloads = payloads
        self.analyzer = analyzer
        self.logger = logger or setup_logger('sqli_module')
        self.time_threshold = time_threshold

    async def _get_baseline(self, session, url, samples: int = 3):
        times = []
        text = ''
        status = None
        for _ in range(samples):
            try:
                start = time.time()
                async with session.get(url, timeout=15) as r:
                    text = await r.text(errors='ignore')
                    status = r.status
                    duration = time.time() - start
                    times.append(duration)
            except Exception as e:
                self.logger.info({'event': 'baseline_error', 'url': url, 'error': str(e)})
                times.append(0.0)
        stats = self.analyzer.compute_time_stats(times)
        return status, text, stats['mean'], stats['stdev']

    def _inject_param(self, url, param, payload):
        parsed = urlparse(url)
        qs = parse_qs(parsed.query)
        qs[param] = [payload]
        new_q = urlencode(qs, doseq=True)
        return urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_q, parsed.fragment))

    async def run(self, session, endpoint):
        results = []
        url = endpoint['url']
        method = endpoint.get('method', 'GET').upper()
        params = endpoint.get('params') or []

        if not params:
            params = ['q', 'id', 'search', 'page']

        base_status, base_text, base_mean, base_stdev = await self._get_baseline(session, url)
        # calibrate time threshold dynamically
        tuned_threshold = self.analyzer.tune_time_threshold([base_mean], multiplier=2.5, min_threshold=self.time_threshold)

        for p_item in self.payloads:
            if isinstance(p_item, dict):
                p = p_item.get('payload')
                tags = p_item.get('tags', [])
            else:
                p = p_item
                tags = []
            for param in params:
                target = self._inject_param(url, param, p)
                start = time.time()
                try:
                    async with session.get(target, timeout=30) as resp:
                        text = await resp.text(errors='ignore')
                        status = resp.status
                except Exception as e:
                    self.logger.info({'event': 'request_error', 'url': target, 'error': str(e)})
                    continue
                duration = time.time() - start

                # time-based detection: compare to tuned threshold
                if duration > tuned_threshold:
                    results.append({'url': url, 'param': param, 'payload': p, 'tags': tags, 'evidence': f'slow response {duration:.1f}s', 'severity': 'high'})
                    self.logger.info({'event': 'sqli_time', 'url': url, 'param': param, 'delay': duration, 'threshold': tuned_threshold})

                # error-based detection
                if self.analyzer.contains_sql_error(text):
                    results.append({'url': url, 'param': param, 'payload': p, 'tags': tags, 'evidence': 'sql error signature', 'severity': 'high'})
                    self.logger.info({'event': 'sqli_error', 'url': url, 'param': param})

                # response diff heuristic (medium severity)
                if abs(len(text) - len(base_text)) > 400:
                    results.append({'url': url, 'param': param, 'payload': p, 'tags': tags, 'evidence': 'response size diff', 'severity': 'medium'})

        return results
