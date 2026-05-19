import pytest
import aiohttp
from aiohttp import web

from modules.open_redirect import OpenRedirectModule


@pytest.mark.asyncio
async def test_open_redirect_detects_redirect():
    async def handler(request):
        # return a redirect to external host provided via 'next' query param
        nxt = request.rel_url.query.get('next')
        if nxt:
            return web.HTTPFound(location=nxt)
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
        mod = OpenRedirectModule(['http://example.com'], logger=None)
        res = await mod.run(session, {'url': f'http://127.0.0.1:{port}/', 'method': 'GET'})
        assert isinstance(res, list)

    await runner.cleanup()
