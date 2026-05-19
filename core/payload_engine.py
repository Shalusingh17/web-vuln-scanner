from pathlib import Path
from typing import List, Dict, Any
import urllib.parse


class PayloadEngine:
    """Loads payload lists and supports simple mutation and tagging.

    Payload format (plain text):
      payload || tag1,tag2

    Methods return a list of dicts:
      {"payload": str, "tags": [str]}
    """

    def __init__(self, mapping: dict):
        self.mapping = mapping

    def _parse_line(self, line: str) -> Dict[str, Any]:
        # allow optional tags separated by '||'
        if '||' in line:
            p, t = line.split('||', 1)
            tags = [x.strip() for x in t.split(',') if x.strip()]
            return {'payload': p.strip(), 'tags': tags}
        return {'payload': line.strip(), 'tags': []}

    def load(self, key: str) -> List[Dict[str, Any]]:
        raw = self.mapping.get(key)
        if not raw:
            return []
        path = Path(raw)
        if not path.exists():
            return []
        items = []
        for line in path.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            items.append(self._parse_line(line))
        return items

    def _mutate(self, payload: str) -> List[str]:
        variants = [payload]
        # urlencode
        try:
            u = urllib.parse.quote_plus(payload)
            if u != payload:
                variants.append(u)
                # double-encode
                variants.append(urllib.parse.quote_plus(u))
        except Exception:
            pass
        # case variations for alphabetic payloads
        if any(c.isalpha() for c in payload):
            variants.extend([payload.lower(), payload.upper(), payload.capitalize()])
        # strip duplicates while preserving order
        seen = set()
        out = []
        for v in variants:
            if v not in seen:
                seen.add(v)
                out.append(v)
        return out

    def iter_for(self, key: str, mutate: bool = True):
        items = self.load(key)
        for it in items:
            if mutate:
                for v in self._mutate(it['payload']):
                    yield {'payload': v, 'tags': it.get('tags', [])}
            else:
                yield it
