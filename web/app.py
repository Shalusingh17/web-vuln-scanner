from flask import Flask, render_template, request, redirect, url_for
import asyncio
from core.scanner import AsyncScanner
from utils.logger import setup_logger

app = Flask(__name__)
logger = setup_logger('vuln_scanner_web')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form.get('target_url')
        if not url:
            return render_template('index.html', error='Please provide a URL')
        # run async scanner synchronously for demo (blocking)
        scanner = AsyncScanner()
        results = asyncio.run(scanner.scan(url))
        return render_template('index.html', url=url, results=results)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
