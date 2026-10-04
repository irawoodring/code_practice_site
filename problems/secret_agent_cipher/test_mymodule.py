import pytest

from mymodule import encode, decode


def test_encode_simple():
    assert encode("abc", 3) == "def"


def test_encode_wraps_around():
    assert encode("xyz", 3) == "abc"


def test_encode_uppercase():
    assert encode("ABC", 1) == "BCD"
    assert encode("Z", 1) == "A"


def test_encode_mixed_case_and_punctuation():
    assert encode("Hello, World!", 5) == "Mjqqt, Btwqi!"


def test_encode_digits_unchanged():
    assert encode("Agent 007", 2) == "Cigpv 007"


def test_shift_zero():
    assert encode("Secret", 0) == "Secret"


def test_shift_26_is_no_change():
    assert encode("Secret", 26) == "Secret"


def test_large_shift():
    assert encode("abc", 29) == "def"


def test_decode_simple():
    assert decode("def", 3) == "abc"


def test_decode_wraps_around():
    assert decode("abc", 3) == "xyz"


def test_decode_message():
    assert decode("Mjqqt, Btwqi!", 5) == "Hello, World!"


def test_round_trip():
    message = "Meet me at the docks at 9pm."

    for shift in [1, 7, 13, 25, 40]:
        assert decode(encode(message, shift), shift) == message


def test_empty_message():
    assert encode("", 4) == ""
    assert decode("", 4) == ""
