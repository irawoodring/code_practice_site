import pytest

from mymodule import is_balanced, first_error


def test_balanced_simple():
    assert is_balanced("()") is True
    assert is_balanced("[]") is True
    assert is_balanced("{}") is True


def test_balanced_nested():
    assert is_balanced("{[()()]}") is True


def test_balanced_with_other_characters():
    assert is_balanced("(a + b) * [c - d]") is True
    assert is_balanced("def f(x): return {'a': [x]}") is True


def test_empty_and_no_brackets():
    assert is_balanced("") is True
    assert is_balanced("hello") is True


def test_wrong_kind():
    assert is_balanced("(]") is False


def test_wrong_order():
    assert is_balanced("([)]") is False


def test_never_closed():
    assert is_balanced("(()") is False


def test_extra_closer():
    assert is_balanced("())") is False


def test_closer_first():
    assert is_balanced(")(") is False


def test_first_error_balanced():
    assert first_error("{[()]}") == -1
    assert first_error("") == -1


def test_first_error_extra_closer():
    assert first_error("(a + b))") == 7


def test_first_error_wrong_order():
    assert first_error("([)]") == 2


def test_first_error_closer_at_start():
    assert first_error("]abc") == 0


def test_first_error_unclosed():
    assert first_error("x = (1 + [2") == 4


def test_first_error_unclosed_after_balanced_part():
    assert first_error("()[]{") == 4


def test_first_error_only_reports_never_closed():
    assert first_error("((())") == 0
    assert first_error("(()(") == 0
