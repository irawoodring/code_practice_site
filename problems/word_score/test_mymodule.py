import pytest
from word_score import word_score


def test_single_letters():
    assert word_score("a") == 1
    assert word_score("s") == 2
    assert word_score("b") == 3


def test_vowels():
    assert word_score("AEIOU") == 5
    assert word_score("aeiou") == 5


def test_word_examples():
    assert word_score("cat") == 7
    assert word_score("python") == 15
    assert word_score("test") == 8


def test_capitalization():
    assert word_score("Python") == word_score("python")
    assert word_score("CAT") == word_score("cat")


def test_longer_words():
    assert word_score("computer") == 20
    assert word_score("programming") == 28


def test_empty_string():
    assert word_score("") == 0
