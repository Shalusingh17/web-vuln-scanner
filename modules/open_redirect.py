import urllib.parse
from utils.logger import setup_logger
from utils.net import resolve_host, is_private_ip


class OpenRedirectModule:
    """Enhanced Open Redirect detection.

    - Tries multiple bypass encodings and protocol-relative variants
    - Validates Location header, redirect chain, and resolved IPs
    - Uses structured logs
    """

    name = 'open_redirect'

    def __init__(self, payloads, logger=None):
        self.payloads = payloads
        self.logger = logger or setup_logger('open_redirect')

    def _variants(self, host: str):
        # generate common bypass variants
        # if a full URL provided, extract netloc
        try:
            parsed = urllib.parse.urlparse(host)
            base = parsed.netloc or parsed.path
        except Exception:
            base = host
        enc = urllib.parse.quote_plus(base)
        return [base, '//' + base, 'http://' + base, 'https://' + base, enc, '%2f%2f' + base]

    async def run(self, session, endpoint):
        results = []
        url = endpoint['url']
        method = endpoint.get('method', 'GET').upper()

        for p in self.payloads:
            if isinstance(p, dict):
                raw = p.get('payload')
                tags = p.get('tags', [])
            else:
                raw = p
                tags = []
            for v in self._variants(raw):
                params = {'next': v}
                try:
                    # don't auto-follow redirects; inspect headers
                    async with session.request(method, url, params=params, allow_redirects=False, timeout=15) as resp:
                        loc = resp.headers.get('Location')
                        status = resp.status
                        if loc:
                            # normalize location
                            parsed = urllib.parse.urlparse(loc)
                            host = parsed.netloc or parsed.path
                            # remove possible credentials portion
                            if '@' in host:
                                host = host.split('@')[-1]

                            ips = await resolve_host(host) if host else []
                            private = any(is_private_ip(i) for i in ips)

                            # consider external redirect if host not same as target
                            target_host = urllib.parse.urlparse(url).netloc
                            external = host and host != target_host

                            if external or private:
                                severity = 'high' if private else 'medium'
                                findings = {'url': url, 'payload': v, 'evidence': f'redirects to {loc}', 'status': status, 'resolved_ips': ips, 'severity': severity}
                                results.append(findings)
                                self.logger.info({'event': 'open_redirect_detected', 'target': url, 'location': loc, 'ips': ips, 'severity': severity})

                        # also follow simple redirect chain (1 hop) to catch indirect
                        if 300 <= status < 400 and resp.headers.get('Location'):
                            try:
                                async with session.get(resp.headers.get('Location'), timeout=10) as final:
                                    final_loc = str(final.url)
                                    final_status = final.status
                                    self.logger.info({'event': 'redirect_chain', 'from': url, 'to': final_loc, 'status': final_status})
                            except Exception:
                                pass
                except Exception as e:
                    self.logger.info({'event': 'request_error', 'url': url, 'error': str(e)})
                    continue

        return results
