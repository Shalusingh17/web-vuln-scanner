import time
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from utils.logger import setup_logger


class XSSModule:
    """Improved reflected XSS module.

    - Computes baseline response per endpoint
    - Injects payloads into discovered parameter names (query/form params)
    - Reflection check ensures payload appears unescaped and not present in baseline
    """

    name = 'xss'

    def __init__(self, payloads, analyzer, logger=None):
        self.payloads = payloads
        self.analyzer = analyzer
        self.logger = logger or setup_logger('xss_module')

    async def _get_baseline(self, session, url):
        try:
            async with session.get(url, timeout=15) as r:
                text = await r.text(errors='ignore')
                return r.status, text
        except Exception as e:
            self.logger.info({'event': 'baseline_error', 'url': url, 'error': str(e)})
            return None, ''

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

        # if no params discovered, use common parameter names to try
        if not params:
            params = ['q', 'search', 'id', 'page', 'redirect', 'next', 'url']

        base_status, base_text = await self._get_baseline(session, url)

        for p_item in self.payloads:
            # p_item may be dict from PayloadEngine: {'payload':..., 'tags':[...]}
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
                    async with session.get(target, timeout=15) as resp:
                        text = await resp.text(errors='ignore')
                        status = resp.status
                except Exception as e:
                    self.logger.info({'event': 'request_error', 'url': target, 'error': str(e)})
                    continue
                duration = time.time() - start

                # Ensure payload not present in baseline and appears in response
                if self.analyzer.contains_reflection(p, base_text or '', text):
                    # context-aware reflection detected
                    results.append({'url': url, 'param': param, 'payload': p, 'tags': tags, 'evidence': text[:600], 'status': status, 'duration': duration, 'severity': 'high'})
                    self.logger.info({'event': 'xss_reflected', 'url': url, 'param': param, 'tags': tags})
                else:
                    # DOM indicator heuristic: presence of script tags or event attributes not present in baseline
                    lowered = text.lower()
                    if ('<script' in lowered or 'onerror' in lowered or 'onclick' in lowered) and p not in base_text:
                        results.append({'url': url, 'param': param, 'payload': p, 'tags': tags, 'evidence': 'DOM-like indicator', 'status': status, 'duration': duration, 'severity': 'medium'})
                        self.logger.info({'event': 'xss_dom_indicator', 'url': url, 'param': param, 'tags': tags})

        return results
