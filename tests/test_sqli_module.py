import asyncio
import pytest
import aiohttp
from aiohttp import web

from modules.sqli import SQLiModule
from core.analyzer import Analyzer


@pytest.mark.asyncio
async def test_sqli_time_and_error():
    async def handler(request):
        q = request.rel_url.query.get('q', '')
        # simulate error signature
        if 'ERRSIG' in q:
            return web.Response(text='You have an SQL syntax error', status=500)
        # simulate sleep payload (short sleep for deterministic test)
        if 'SLEEP' in q:
            await asyncio.sleep(0.35)
            return web.Response(text='done')
        return web.Response(text='ok')

    app = web.Application()
    app.router.add_get('/', handler)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '127.0.0.1', 0)
    await site.start()
    sock = site._server.sockets[0]
    port = sock.getsockname()[1]

    async with aiohttp.ClientSession() as session:
        payloads = ["' OR ERRSIG --", "' OR SLEEP(0.3) -- SLEEP"]
        # set a low threshold to detect the small sleep in handler
        mod = SQLiModule(payloads, Analyzer(), time_threshold=0.1)
        res = await mod.run(session, {'url': f'http://127.0.0.1:{port}/', 'method': 'GET'})
        assert isinstance(res, list)
        # expect at least one finding for time-based or error-based
        assert len(res) >= 1

    await runner.cleanup()
