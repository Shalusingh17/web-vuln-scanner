import asyncio
from urllib.parse import urljoin, urldefrag, urlparse, parse_qs
from bs4 import BeautifulSoup


class Crawler:
    """Robust asynchronous crawler that discovers URLs, parameters and forms.

    Returns endpoints as dicts with: url, method, params (list of param names)
    """

    def __init__(self, session, rate_limiter=None, max_depth=2, follow_external=False):
        self.session = session
        self.rate_limiter = rate_limiter
        self.max_depth = max_depth
        self.follow_external = follow_external
        self.seen = set()
        self.to_fetch = asyncio.Queue()
        self.results = []

    async def enqueue(self, start_url, path, depth=0):
        await self.to_fetch.put((start_url, path, depth))

    async def extract(self, base_url, html):
        soup = BeautifulSoup(html, 'html.parser')
        links = []
        for a in soup.find_all('a', href=True):
            href = a['href']
            full = urljoin(base_url, href)
            full = urldefrag(full)[0]
            links.append(full)

        forms = []
        for f in soup.find_all('form'):
            action = f.get('action') or base_url
            method = f.get('method', 'get').upper()
            action_url = urljoin(base_url, action)
            # collect input names (simple inputs only)
            inputs = [i.get('name') for i in f.find_all(['input', 'textarea', 'select']) if i.get('name')]
            forms.append({'url': action_url, 'method': method, 'params': inputs})

        return links, forms

    async def worker(self):
        from utils.http import fetch

        while not self.to_fetch.empty():
            start_url, path, depth = await self.to_fetch.get()
            if path in self.seen or depth > self.max_depth:
                self.to_fetch.task_done()
                continue
            self.seen.add(path)
            try:
                resp = await fetch(self.session, 'GET', path, allow_redirects=True)
                if resp.get('status') in ('timeout', 'error'):
                    self.to_fetch.task_done()
                    continue
                html = resp.get('text', '')
                links, forms = await self.extract(path, html)

                # record the current URL's query params
                parsed = urlparse(path)
                qs = parse_qs(parsed.query)
                param_names = list(qs.keys())
                self.results.append({'url': path, 'method': 'GET', 'params': param_names})

                for l in links:
                    parsed_l = urlparse(l)
                    if not parsed_l.scheme.startswith('http'):
                        continue
                    # respect follow_external flag
                    if not self.follow_external and urlparse(start_url).netloc != parsed_l.netloc:
                        continue
                    await self.enqueue(start_url, l, depth + 1)

                for f in forms:
                    # include form params discovered
                    self.results.append({'url': f['url'], 'method': f['method'], 'params': f.get('params', [])})
            finally:
                self.to_fetch.task_done()

    async def crawl(self, start_url):
        await self.enqueue(start_url, start_url, depth=0)
        workers = [asyncio.create_task(self.worker()) for _ in range(4)]
        await self.to_fetch.join()
        for w in workers:
            w.cancel()
        return self.results
