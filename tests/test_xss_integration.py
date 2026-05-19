import asyncio
import aiohttp
from aiohttp import web
import pytest

from modules.xss import XSSModule
from core.analyzer import Analyzer


@pytest.mark.asyncio
async def test_xss_module_reflection():
    # simple echo handler that reflects query param 'q'
    async def handler(request):
        q = request.rel_url.query.get('q', '')
        text = f"<html><body>echo:{q}</body></html>"
        return web.Response(text=text, content_type='text/html')

    app = web.Application()
    app.router.add_get('/', handler)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '127.0.0.1', 0)
    await site.start()

    # discover bound port
    sockets = site._server.sockets
    assert sockets, "Test server failed to start"
    host, port = sockets[0].getsockname()[0:2]
    base_url = f"http://{host}:{port}/"

    # run XSSModule against the test server
    analyzer = Analyzer()
    payloads = [{'payload': 'INJ_TEST_123', 'tags': []}]

    async with aiohttp.ClientSession() as session:
        mod = XSSModule(payloads, analyzer)
        results = await mod.run(session, {'url': base_url, 'params': ['q']})

    # cleanup
    await runner.cleanup()

    assert isinstance(results, list)
    assert any(r['payload'] == 'INJ_TEST_123' for r in results), "Payload not reflected as expected"
