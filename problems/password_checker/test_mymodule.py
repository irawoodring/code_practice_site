import pytest

from mymodule import password_problems, is_strong


def test_strong_password():
    assert password_problems("Tr0ub4dor&3") == []


def test_example_hello():
    assert password_problems("hello") == [
        "too short",
        "no uppercase",
        "no digit",
        "no special",
    ]


def test_example_spaces():
    assert password_problems("Sunny Day 42!") == ["has spaces"]


def test_too_short_only():
    assert password_problems("Ab1!") == ["too short"]


def test_exactly_eight_is_long_enough():
    assert password_problems("Abcdef1!") == []


def test_no_uppercase():
    assert password_problems("abcdef1!") == ["no uppercase"]


def test_no_lowercase():
    assert password_problems("ABCDEF1!") == ["no lowercase"]


def test_no_digit():
    assert password_problems("Abcdefg!") == ["no digit"]


def test_no_special():
    assert password_problems("Abcdefg1") == ["no special"]


def test_each_special_character_counts():
    for ch in "!@#$%^&*?":
        assert password_problems("Abcdefg1" + ch) == []


def test_other_punctuation_is_not_special():
    assert password_problems("Abcdefg1.") == ["no special"]


def test_empty_password():
    assert password_problems("") == [
        "too short",
        "no uppercase",
        "no lowercase",
        "no digit",
        "no special",
    ]


def test_every_problem():
    assert password_problems(" ") == [
        "too short",
        "no uppercase",
        "no lowercase",
        "no digit",
        "no special",
        "has spaces",
    ]


def test_is_strong_true():
    assert is_strong("Tr0ub4dor&3") is True


def test_is_strong_false():
    assert is_strong("password") is False
    assert is_strong("Sunny Day 42!") is False
