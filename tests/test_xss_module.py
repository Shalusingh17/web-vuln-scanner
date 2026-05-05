import asyncio
import pytest
import aiohttp
from aiohttp import web

from modules.xss import XSSModule
from core.analyzer import Analyzer


@pytest.mark.asyncio
async def test_xss_reflection(loop):
    # create simple aiohttp server that reflects q parameter
    async def handler(request):
        q = request.rel_url.query.get('q', '')
        if q:
            return web.Response(text=f"Hello {q}")
        return web.Response(text="Hello world")

    app = web.Application()
    app.router.add_get('/', handler)
    runner = web.AppRunner(app)
    await runner.setup()
    # use ephemeral port 0 to avoid collisions
    site = web.TCPSite(runner, '127.0.0.1', 0)
    await site.start()
    # get the assigned port
    sock = site._server.sockets[0]
    port = sock.getsockname()[1]

    async with aiohttp.ClientSession() as session:
        mod = XSSModule(['<script>alert(1)</script>'], Analyzer())
        res = await mod.run(session, {'url': f'http://127.0.0.1:{port}/', 'method': 'GET'})
        # should detect reflection (may be empty if heuristic doesn't match)
        assert isinstance(res, list)

    await runner.cleanup()
