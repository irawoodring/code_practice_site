from mymodule import decode_message


def test_simple_word():
    assert decode_message("ifmmp") == "hello"


def test_multiple_words():
    assert decode_message("uijt jt b tfdsfu") == "this is a secret"


def test_wraps_around():
    assert decode_message("bqqmf") == "apple"


def test_a_becomes_z():
    assert decode_message("b") == "a"
    assert decode_message("a") == "z"


def test_punctuation_is_unchanged():
    assert decode_message("ifmmp!") == "hello!"


def test_spaces_are_unchanged():
    assert decode_message("ifmmp xpsme") == "hello world"


def test_numbers_are_unchanged():
    assert decode_message("ifmmp 123") == "hello 123"


def test_empty_message():
    assert decode_message("") == ""


def test_longer_message():
    message = "uif rvjdl cspxo gpy"
    expected = "the quick brown fox"

    assert decode_message(message) == expected
