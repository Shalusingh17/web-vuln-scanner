from core.analyzer import Analyzer


def test_response_diff():
    a = Analyzer()
    assert a.response_diff('hello', 'hello world') == abs(len('hello') - len('hello world'))


def test_contains_sql_error():
    a = Analyzer()
    assert a.contains_sql_error('Syntax error near') is True
    assert a.contains_sql_error('no sql here') is False
