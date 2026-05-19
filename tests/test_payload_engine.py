from core.payload_engine import PayloadEngine


def test_load_payloads():
    mapping = {'xss': 'payloads/xss.txt', 'sqli': 'payloads/sqli.txt'}
    pe = PayloadEngine(mapping)
    x = pe.load('xss')
    s = pe.load('sqli')
    assert isinstance(x, list)
    assert isinstance(s, list)
    assert len(x) > 0
