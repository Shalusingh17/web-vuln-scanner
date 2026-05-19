import urllib.parse
from utils.logger import setup_logger
from utils.net import resolve_host, is_private_ip
import asyncio


class SSRFModule:
    """Improved SSRF module.

    - Injects internal host payloads and common bypass variants
    - Checks response content, status codes and DNS resolution of target host
    - Attempts to reduce false positives with multiple heuristics
    """

    name = 'ssrf'

    def __init__(self, payloads, logger=None):
        self.payloads = payloads
        self.logger = logger or setup_logger('ssrf')

    def _variants(self, host: str):
        # include encoded and protocol-relative variants to catch bypasses
        enc = urllib.parse.quote_plus(host)
        return [host, '//' + host, 'http://' + host, 'https://' + host, enc, host.replace(':', '%3A')]

    async def run(self, session, endpoint):
        results = []
        url = endpoint['url']
        method = endpoint.get('method', 'GET').upper()
        params_to_test = ['url', 'uri', 'path', 'host', 'target']

        # quick baseline
        try:
            async with session.request('GET', url, timeout=10) as r:
                base_text = await r.text(errors='ignore')
                base_status = r.status
        except Exception:
            base_text = ''
            base_status = None

        for p_item in self.payloads:
            if isinstance(p_item, dict):
                raw = p_item.get('payload')
                tags = p_item.get('tags', [])
            else:
                raw = p_item
                tags = []
            for v in self._variants(raw):
                for param in params_to_test:
                    params = {param: v}
                    try:
                        async with session.request(method, url, params=params, timeout=15) as resp:
                            text = await resp.text(errors='ignore')
                            status = resp.status
                    except Exception as e:
                        self.logger.info({'event': 'request_error', 'url': url, 'error': str(e)})
                        continue

                    lowered = text.lower()

                    # heuristics: metadata indicators, connection messages, status changes
                    indicators = ['169.254.169.254', 'metadata', 'instance-id', 'aws']
                    if any(i in lowered for i in indicators):
                        findings = {'url': url, 'param': param, 'payload': v, 'evidence': 'metadata-like content', 'status': status, 'severity': 'high'}
                        results.append(findings)
                        self.logger.info({'event': 'ssrf_metadata', 'target': url, 'param': param})
                        continue

                    if 'connection refused' in lowered or 'refused' in lowered or 'timed out' in lowered:
                        # possible SSRF attempt against internal host
                        findings = {'url': url, 'param': param, 'payload': v, 'evidence': 'connection/refused/timeout seen', 'status': status, 'severity': 'medium'}
                        results.append(findings)
                        self.logger.info({'event': 'ssrf_conn', 'target': url, 'param': param})

                    # DNS-based detection: resolve provided host and check for internal IPs
                    try:
                        parsed = urllib.parse.urlparse(v)
                        host = parsed.hostname or v
                        ips = await resolve_host(host)
                        if any(is_private_ip(i) for i in ips):
                            findings = {'url': url, 'param': param, 'payload': v, 'tags': tags, 'evidence': f'resolved to internal IPs {ips}', 'status': status, 'severity': 'high'}
                            results.append(findings)
                            self.logger.info({'event': 'ssrf_dns_private', 'target': url, 'param': param, 'ips': ips})
                    except Exception:
                        pass

                    # reduce FP: if payload appears in baseline, ignore
                    if v in base_text:
                        continue

        # dedupe results by (url,param,payload)
        seen = set()
        dedup = []
        for r in results:
            key = (r.get('url'), r.get('param'), r.get('payload'))
            if key in seen:
                continue
            seen.add(key)
            dedup.append(r)

        return dedup
