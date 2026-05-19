import pytest
import aiohttp
from aiohttp import web
import asyncio

from modules.ssrf import SSRFModule


@pytest.mark.asyncio
async def test_ssrf_detects_metadata_like_content():
    async def handler(request):
        param = request.rel_url.query.get('url','')
        if '169.254.169.254' in param:
            return web.Response(text='instance-id: i-abcdef')
        return web.Response(text='ok')

    app = web.Application()
    app.router.add_get('/', handler)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '127.0.0.1', 0)
    await site.start()
    sock = site._server.sockets[0]
    port = sock.getsockname()[1]

    # monkeypatch DNS resolution to return internal IPs for the test
    import utils.net as netmod

    async def fake_resolve(host):
        return ['169.254.169.254']

    # use monkeypatch fixture if available, else set attribute directly
    try:
        # pytest provides monkeypatch automatically when requested, but tests may not have parameter
        # set attribute directly
        netmod.resolve_host = fake_resolve
    except Exception:
        netmod.resolve_host = fake_resolve

    async with aiohttp.ClientSession() as session:
        mod = SSRFModule(['http://169.254.169.254'], logger=None)
        res = await mod.run(session, {'url': f'http://127.0.0.1:{port}/', 'method': 'GET'})
        assert isinstance(res, list)
        assert any('metadata' in (r.get('evidence') or '').lower() or 'resolved to internal' in (r.get('evidence') or '').lower() or 'resolved to internal' in (r.get('evidence') or '').lower() for r in res)

    await runner.cleanup()
