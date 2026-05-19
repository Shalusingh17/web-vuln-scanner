<<<<<<< HEAD
# web-vuln-scanner
A full-stack web vulnerability scanner SaaS
=======

# Mini Web Vulnerability Scanner — Async, modular educational scanner

An asynchronous, modular web vulnerability scanner implemented in Python. Built for learning and small-scale authorized assessments, the project demonstrates practical vulnerability detection patterns (XSS, SQLi, SSRF, Open Redirect), payload engineering, and test-driven development for security tools.

## What this solves
Provides a lightweight, extensible framework for discovering common web vulnerabilities across application endpoints while demonstrating safe scanning practices (rate limiting, private-IP checks, and scoped scanning).

## Key features
- Reflected XSS detection (tokenized reflection + basic context checks)
- SQL injection detection (error-based and time-based techniques)
- SSRF detection and Open Redirect discovery with private-IP protection
- Asynchronous scanning engine using `aiohttp` for concurrency
- URL/path crawler and form/parameter discovery
- Payload engine with tagging and simple mutations (URL-encoding, double-encoding)
- JSON and HTML reporting for automation and human review
- Minimal Flask demo UI and CLI for quick demonstrations

## Architecture overview
- `core/` — orchestrator, concurrent scanner, crawler, payload engine, analyzer, reporter
- `modules/` — independent vulnerability detectors (`xss.py`, `sqli.py`, `open_redirect.py`, `ssrf.py`) that implement a simple detection contract
- `utils/` — HTTP helpers, logging, rate limiting, network checks, configuration
- `payloads/` — canonical and advanced payload lists
- `tests/` — unit and integration-style tests using `pytest` and `pytest-asyncio`

## Installation (recommended: Windows PowerShell)
1. Install Python 3.11: https://www.python.org/downloads/release/python-3110/
2. Create and activate a virtual environment from the project root:

```powershell
py -3.11 -m venv venv311
.\venv311\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install --prefer-binary -r requirements.txt
```

## Running the test suite

```powershell
python -m pip install pytest pytest-asyncio
python -m pytest -q
```

## Usage examples

**Quick CLI scan**

```powershell
python cli.py --target https://example.com --output reports/example.json --concurrency 8 --timeout 15
```

**Common flags**
- `--target` (required): target URL
- `--output`: JSON output file
- `--concurrency`: workers
- `--timeout`: request timeout (s)

**Run the demo web UI** (development only):

```powershell
python web/app.py
# open http://127.0.0.1:5000
```

## Sample output (JSON, trimmed)

```json
{
  "target": "https://example.com",
  "summary": { "scanned_paths": 12, "findings": 2 },
  "findings": [
    {
      "type": "xss",
      "path": "/search",
      "param": "q",
      "payload": "<script>alert(1)</script>",
      "evidence": "reflected in response body",
      "confidence": "medium"
    }
  ]
}
```

## Design notes to reduce false positives
- The scanner uses tokenized payloads and response-diff heuristics. For higher confidence, combine token reflection with context-aware checks (HTML body vs attribute) and known-error patterns for SQLi.

## Ethical & legal disclaimer
Only run this scanner against systems you own or have explicit authorization to test. Misuse of this tool may be illegal and unethical. The project is provided for educational purposes only.

## Contributing
Keep changes small, document behavior changes, and include unit tests for new features. Use the `tests/` harness for deterministic verification.

## License
MIT — see `LICENSE` for full text.

## Support / contact
Open issues or PRs on the repository for questions or improvements.   

>>>>>>> 804c0c6e161cc2fbf8b4c69d42ee6682418c2c2a
