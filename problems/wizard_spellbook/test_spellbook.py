from spellbook import spell_power


def test_simple_word():
    assert spell_power("magic") == 3


def test_fireball():
    assert spell_power("fireball") == 5


def test_abracadabra():
    assert spell_power("abracadabra") == 6


def test_multiple_words():
    assert spell_power("magic missile") == 7


def test_all_vowels():
    assert spell_power("aeiou") == 0


def test_all_consonants():
    assert spell_power("bcdfg") == 5


def test_punctuation():
    assert spell_power("!!!") == 0


def test_spaces_and_punctuation():
    assert spell_power("hello, wizard!") == 7


def test_empty_string():
    assert spell_power("") == 0
