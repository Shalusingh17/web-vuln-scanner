import time
from difflib import SequenceMatcher
from bs4 import BeautifulSoup
import statistics


class Analyzer:
    """Analyze responses for diffs, timing, status changes and reflection.

    Improved heuristics: provides ratio-based diffs, reflection context checks,
    and simple timing statistics utilities.
    """

    @staticmethod
    def response_diff_ratio(base_text: str, test_text: str) -> float:
        # ratio: 0..1 where 1.0 means identical
        if not base_text and not test_text:
            return 1.0
        return SequenceMatcher(None, base_text, test_text).ratio()

    @staticmethod
    def response_length_diff(base_text: str, test_text: str) -> int:
        return abs(len(test_text) - len(base_text))

    # Backwards-compatible alias expected by older tests
    @staticmethod
    def response_diff(base_text: str, test_text: str) -> int:
        return Analyzer.response_length_diff(base_text, test_text)

    @staticmethod
    def time_delay(start: float, end: float) -> float:
        return end - start

    @staticmethod
    def contains_sql_error(text: str, error_signatures=None) -> bool:
        if not error_signatures:
            error_signatures = [
                'sql syntax', 'mysql', 'syntax error', 'unclosed quotation mark',
                'sqlite', 'warning: mysql', 'pg_query()', 'oracle', 'sqlstate', 'syntax error'
            ]
        t = (text or '').lower()
        return any(s in t for s in error_signatures)

    @staticmethod
    def contains_reflection(payload: str, base_text: str, test_text: str) -> bool:
        """Check if payload appears in test_text but not in base_text and
        appears in a context likely to be reflected (text node or attribute).
        """
        if not payload:
            return False
        if payload in base_text:
            return False
        if payload not in test_text:
            return False

        # parse HTML and search for payload in text nodes or attributes
        try:
            soup = BeautifulSoup(test_text, 'html.parser')
            # check attributes
            for tag in soup.find_all(True):
                for attr, val in tag.attrs.items():
                    if isinstance(val, list):
                        vals = ' '.join(val)
                    else:
                        vals = str(val)
                    if payload in vals:
                        return True
            # check visible text
            if payload in soup.get_text():
                return True
        except Exception:
            # fallback: simple substring check
            return payload in test_text and payload not in base_text
        return False

    @staticmethod
    def compute_time_stats(samples: list) -> dict:
        if not samples:
            return {'mean': 0.0, 'stdev': 0.0}
        mean = statistics.mean(samples)
        stdev = statistics.pstdev(samples) if len(samples) > 1 else 0.0
        return {'mean': mean, 'stdev': stdev}

    @staticmethod
    def tune_time_threshold(base_samples: list, multiplier: float = 3.0, min_threshold: float = 1.5) -> float:
        stats = Analyzer.compute_time_stats(base_samples)
        return max(min_threshold, stats['mean'] + multiplier * stats['stdev'])
