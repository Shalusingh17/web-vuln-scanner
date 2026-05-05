# Mini Web Vulnerability Scanner

A lightweight, modular, asynchronous web vulnerability scanner implemented in Python. Designed for research, learning, and small-scale assessments, the scanner provides extensible detectors, a flexible payload engine, and both CLI and web-based interfaces.

**Key Features**
- Async HTTP engine using `aiohttp` for high-concurrency scanning
- Modular vulnerability detectors: reflected XSS, SQL injection (error & time-based), open redirect, SSRF
- Payload engine with tagging and mutations (URL-encoding, double-encoding, case variants)
- Form discovery and parameter injection via a lightweight crawler
- Structured JSON and optional HTML reports for easy consumption
- CLI for scripted runs and a simple Flask-based UI for interactive sessions

**Quickstart (Windows PowerShell)**
1. Install Python 3.11 (recommended).
2. From the project root:

```powershell
py -3.11 -m venv venv311
.\venv311\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install --prefer-binary -r requirements.txt
python -m pip install pytest pytest-asyncio
python -m pytest -q
```

**Usage — CLI**
- Run a scan from the command line:

```powershell
python cli.py --target https://target.example --output reports/target.json
```

**Usage — Web UI**
- Start the Flask demo UI and open your browser:

```powershell
python run.py
# then open http://127.0.0.1:5000
```

**Project layout**
- `core/` — scanner orchestrator, crawler, payload engine, analyzer, reporter
- `modules/` — vulnerability modules (`xss`, `sqli`, `open_redirect`, `ssrf`)
- `utils/` — HTTP helpers, logging, rate limiting, network utilities
- `payloads/` — curated payload lists and mutation rules
- `reports/` — generated JSON and HTML reports
- `web/` — Flask-based user interface and example front-end
- `tests/` — unit and integration tests (pytest + pytest-asyncio)

**Development & Testing**
- Create a development virtual environment and install dependencies (see Quickstart).
- Run unit tests:

```powershell
python -m pytest -q
```

**Responsible Use**
This project is educational. Only scan systems you own or have explicit permission to test. Misuse may be illegal and unethical.

**Contributing**
- Contributions are welcome — open issues or submit pull requests. Please include tests for new detectors and follow the existing module pattern.

**License**
This repository is distributed under the MIT License. Add a `LICENSE` file with your preferred terms.

If you want, I can also add a short `docs/` section, sample scans, or CI workflow for automated tests.
