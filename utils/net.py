import asyncio
import socket
import ipaddress
from typing import List


async def resolve_host(host: str) -> List[str]:
    """Resolve a hostname asynchronously and return list of IP strings."""
    loop = asyncio.get_running_loop()
    try:
        infos = await loop.getaddrinfo(host, None, proto=socket.IPPROTO_TCP)
        ips = []
        for family, _, _, _, sockaddr in infos:
            ip = sockaddr[0]
            ips.append(ip)
        # dedupe
        return list(dict.fromkeys(ips))
    except Exception:
        return []


def is_private_ip(ip_str: str) -> bool:
    try:
        ip = ipaddress.ip_address(ip_str)
        return ip.is_private or ip.is_loopback or ip.is_link_local
    except Exception:
        return False
