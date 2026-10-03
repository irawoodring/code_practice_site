import pytest

from mymodule import is_palindrome, find_palindromes, longest_palindrome


def test_simple_palindromes():
    assert is_palindrome("racecar") is True
    assert is_palindrome("level") is True


def test_not_palindrome():
    assert is_palindrome("hello") is False


def test_ignores_case():
    assert is_palindrome("RaceCar") is True


def test_ignores_punctuation_and_spaces():
    assert is_palindrome("A man, a plan, a canal: Panama!") is True
    assert is_palindrome("Was it a car or a cat I saw?") is True


def test_digits():
    assert is_palindrome("12321") is True
    assert is_palindrome("1231") is False


def test_empty_and_single():
    assert is_palindrome("") is True
    assert is_palindrome("x") is True


def test_find_palindromes():
    assert find_palindromes(["kayak", "python", "Noon", "abc"]) == ["kayak", "Noon"]


def test_find_palindromes_none():
    assert find_palindromes(["abc", "def"]) == []


def test_find_palindromes_empty():
    assert find_palindromes([]) == []


def test_longest_palindrome_odd():
    assert longest_palindrome("babad") == "bab"


def test_longest_palindrome_even():
    assert longest_palindrome("cbbd") == "bb"


def test_longest_palindrome_single_chars():
    assert longest_palindrome("abc") == "a"


def test_longest_palindrome_whole_string():
    assert longest_palindrome("racecar") == "racecar"


def test_longest_palindrome_inside():
    assert longest_palindrome("xyzracecarabc") == "racecar"


def test_longest_palindrome_case_sensitive():
    assert longest_palindrome("Abba") == "bb"


def test_longest_palindrome_empty():
    assert longest_palindrome("") == ""
