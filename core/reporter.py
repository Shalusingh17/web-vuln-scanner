import json
from jinja2 import Template


class Reporter:
    """Generate JSON and richer HTML reports from scan results."""

    HTML_TMPL = """
    <html><head><meta charset="utf-8"><title>Scan Report</title>
    <style>body{font-family:Arial; padding:18px;} .card{border:1px solid #ddd;border-radius:6px;padding:12px;margin:8px 0}</style>
    </head><body>
    <h1>Scan Report</h1>
    <p><strong>Targets:</strong> {{ targets|length }} &nbsp; <strong>Findings:</strong> {{ findings|length }}</p>

    <h2>Targets</h2>
    <ul>{% for t in targets %}<li>{{ t.url }} ({{ t.method }})</li>{% endfor %}</ul>

    <h2>Findings</h2>
    {% for f in findings %}
      <div class="card">
        <strong>Module:</strong> {{ f.module }}<br/>
        <strong>Target:</strong> {{ f.url }}<br/>
        <strong>Param:</strong> {{ f.param if f.param else '-' }} &nbsp; <strong>Severity:</strong> {{ f.severity if f.severity else 'low' }}<br/>
        <strong>Payload:</strong> {{ f.payload if f.payload else '-' }}
        <pre>{{ f.evidence }}</pre>
      </div>
    {% else %}
      <div>No findings</div>
    {% endfor %}
    </body></html>
    """

    def generate_json(self, data, path):
        out = dict(data)
        out['meta'] = {'generated_by': 'vuln_scanner', 'version': '0.1'}
        with open(path, 'w', encoding='utf-8') as fh:
            json.dump(out, fh, indent=2)

    def generate_html(self, data, path):
        tpl = Template(self.HTML_TMPL)
        html = tpl.render(targets=data.get('targets', []), findings=data.get('findings', []))
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(html)
