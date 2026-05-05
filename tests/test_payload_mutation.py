import urllib.parse
from core.payload_engine import PayloadEngine


def test_payload_mutation_variants(tmp_path):
    # create a temporary payload file
    p = tmp_path / "p.txt"
    p.write_text("hello world")

    mapping = {'x': str(p)}
    engine = PayloadEngine(mapping)

    variants = [entry['payload'] for entry in engine.iter_for('x')]
    # original should be present
    assert 'hello world' in variants
    # urlencoded (quote_plus) should be present (space -> +)
    assert any('+' in v or '%' in v for v in variants)
    # case variants present
    assert 'HELLO WORLD' in variants or 'Hello world' in variants
