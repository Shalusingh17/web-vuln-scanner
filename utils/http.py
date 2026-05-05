import asyncio
import aiohttp
from aiohttp import ClientTimeout
from typing import Optional


class AioHttpClient:
    """A thin wrapper around aiohttp.ClientSession with timeouts and headers."""

    def __init__(self, timeout: int = 15, user_agent: str = None):
        self.timeout = ClientTimeout(total=timeout)
        headers = {"User-Agent": user_agent} if user_agent else None
        self._session: Optional[aiohttp.ClientSession] = None
        self._headers = headers

    async def __aenter__(self):
        self._session = aiohttp.ClientSession(timeout=self.timeout, headers=self._headers)
        return self._session

    async def __aexit__(self, exc_type, exc, tb):
        if self._session and not self._session.closed:
            await self._session.close()


async def fetch(session: aiohttp.ClientSession, method: str, url: str, **kwargs):
    """Perform an HTTP request and return a dict with useful fields."""
    try:
        async with session.request(method, url, **kwargs) as resp:
            text = await resp.text(errors='ignore')
            return {
                'status': resp.status,
                'text': text,
                'headers': dict(resp.headers)
            }
    except asyncio.TimeoutError:
        return {'status': 'timeout', 'text': '', 'headers': {}}
    except Exception as e:
        return {'status': 'error', 'text': str(e), 'headers': {}}
