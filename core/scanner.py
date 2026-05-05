import asyncio
import aiohttp
from utils.logger import setup_logger
from utils.config import Config
from utils.http import AioHttpClient, fetch
from utils.rate_limiter import HostRateLimiter
from core.payload_engine import PayloadEngine
from core.analyzer import Analyzer
from core.crawler import Crawler
from modules.xss import XSSModule
from modules.sqli import SQLiModule
from modules.open_redirect import OpenRedirectModule
from modules.ssrf import SSRFModule
from core.reporter import Reporter
from pathlib import Path
import time


class AsyncScanner:
    """Main orchestrator for async scanning.

    Responsible for: crawling, scheduling module runs, collecting results,
    rate limiting, timeouts, and report generation.
    """

    def __init__(self, config_path: str = None, logger=None):
        self.config = Config(config_path)
        self.logger = logger or setup_logger('vuln_scanner')
        self.analyzer = Analyzer()
        self.rate_limiter = HostRateLimiter(self.config.get('rate_limit_per_host', 5))
        self.payload_engine = PayloadEngine(self.config.get('payload_paths', {}))
        self.modules = []
        self._register_modules()

    def _register_modules(self):
        # load payloads
        # load both core and advanced payload lists if available
        xss_payloads = list(self.payload_engine.iter_for('xss')) + list(self.payload_engine.iter_for('xss_advanced'))
        sqli_payloads = list(self.payload_engine.iter_for('sqli')) + list(self.payload_engine.iter_for('sqli_advanced'))
        redirect_payloads = list(self.payload_engine.iter_for('redirect_advanced', mutate=True))
        ssrf_payloads = list(self.payload_engine.iter_for('ssrf_advanced', mutate=True))

        # Pass shared logger to modules for structured logs
        self.modules.append(XSSModule(xss_payloads, self.analyzer, logger=self.logger))
        self.modules.append(SQLiModule(sqli_payloads, self.analyzer, logger=self.logger))
        self.modules.append(OpenRedirectModule(redirect_payloads, logger=self.logger))
        self.modules.append(SSRFModule(ssrf_payloads, logger=self.logger))

    async def scan(self, start_url: str):
        timeout = self.config.get('timeout', 15)
        concurrency = self.config.get('concurrency', 10)
        results = {'targets': [], 'findings': []}

        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=timeout), headers={'User-Agent': self.config.get('user_agent')}) as session:
            # 1) Crawl
            crawler = Crawler(session, rate_limiter=self.rate_limiter, max_depth=self.config.get('scan_depth', 1), follow_external=self.config.get('follow_external', False))
            self.logger.info({'event': 'crawl_start', 'target': start_url})
            endpoints = await crawler.crawl(start_url)
            self.logger.info({'event': 'crawl_done', 'count': len(endpoints)})

            # include seed
            endpoints.insert(0, {'url': start_url, 'method': 'GET'})
            results['targets'] = endpoints

            sem = asyncio.Semaphore(concurrency)

            async def run_module_on_endpoint(module, ep):
                async with sem:
                    parsed = aiohttp.helpers.URL(ep['url'])
                    host = parsed.host or ''
                    await self.rate_limiter.acquire(host)
                    try:
                        found = await module.run(session, ep)
                        if found:
                            for f in found:
                                f['module'] = module.name
                                results['findings'].append(f)
                                self.logger.info({'event': 'finding', 'module': module.name, 'target': ep['url'], 'payload': f.get('payload')})
                    except Exception as e:
                        self.logger.info({'event': 'module_error', 'module': module.name, 'error': str(e)})

            tasks = []
            for ep in endpoints:
                for module in self.modules:
                    tasks.append(asyncio.create_task(run_module_on_endpoint(module, ep)))

            # run all tasks with graceful wait
            await asyncio.gather(*tasks)

        # generate report
        reporter = Reporter()
        ts = int(time.time())
        out_dir = Path('reports')
        out_dir.mkdir(parents=True, exist_ok=True)
        json_path = out_dir / f'report_{ts}.json'
        html_path = out_dir / f'report_{ts}.html'
        reporter.generate_json(results, json_path)
        reporter.generate_html(results, html_path)
        self.logger.info({'event': 'scan_complete', 'json': str(json_path), 'html': str(html_path)})
        return results
