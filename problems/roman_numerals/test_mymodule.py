import pytest

from mymodule import to_roman, from_roman


def test_to_roman_simple():
    assert to_roman(1) == "I"
    assert to_roman(3) == "III"
    assert to_roman(16) == "XVI"


def test_to_roman_subtractive():
    assert to_roman(4) == "IV"
    assert to_roman(9) == "IX"
    assert to_roman(40) == "XL"
    assert to_roman(90) == "XC"
    assert to_roman(400) == "CD"
    assert to_roman(900) == "CM"


def test_to_roman_examples():
    assert to_roman(1994) == "MCMXCIV"
    assert to_roman(2026) == "MMXXVI"


def test_to_roman_largest():
    assert to_roman(3999) == "MMMCMXCIX"


def test_to_roman_out_of_range():
    with pytest.raises(ValueError):
        to_roman(0)
    with pytest.raises(ValueError):
        to_roman(4000)
    with pytest.raises(ValueError):
        to_roman(-5)


def test_from_roman_simple():
    assert from_roman("I") == 1
    assert from_roman("XVI") == 16
    assert from_roman("MMXXVI") == 2026


def test_from_roman_subtractive():
    assert from_roman("IV") == 4
    assert from_roman("XC") == 90
    assert from_roman("CM") == 900


def test_from_roman_example():
    assert from_roman("MCMXCIV") == 1994


def test_round_trip():
    for n in range(1, 4000):
        assert from_roman(to_roman(n)) == n
