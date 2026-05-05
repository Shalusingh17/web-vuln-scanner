import yaml
from pathlib import Path


class Config:
    """Load configuration from YAML file with defaults."""

    DEFAULTS = {
        "concurrency": 10,
        "timeout": 15,
        "rate_limit_per_host": 5,
        "scan_depth": 2,
        "follow_external": False,
        "user_agent": "VulnScanner/1.0",
        "payload_paths": {
            "xss": "payloads/xss.txt",
            "sqli": "payloads/sqli.txt"
        }
    }

    def __init__(self, path: str = None):
        self.path = Path(path) if path else None
        self.data = dict(self.DEFAULTS)
        if self.path and self.path.exists():
            with self.path.open("r", encoding="utf-8") as fh:
                cfg = yaml.safe_load(fh) or {}
                self.data.update(cfg)

    def get(self, key, default=None):
        return self.data.get(key, default)

    def __getitem__(self, item):
        return self.data[item]

    def as_dict(self):
        return dict(self.data)
