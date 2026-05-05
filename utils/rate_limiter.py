import asyncio
import time
from collections import defaultdict


class HostRateLimiter:
    """Simple per-host rate limiter using timestamps.

    Not highly precise but sufficient for scanning demos.
    """

    def __init__(self, per_host: int = 5):
        self.per_host = per_host
        self.history = defaultdict(list)
        self.lock = asyncio.Lock()

    async def acquire(self, host: str):
        async with self.lock:
            now = time.time()
            window = 1.0  # per-second window
            self.history[host] = [t for t in self.history[host] if now - t < window]
            if len(self.history[host]) >= self.per_host:
                # need to wait
                await asyncio.sleep(0.2)
                return await self.acquire(host)
            self.history[host].append(now)
            return True
