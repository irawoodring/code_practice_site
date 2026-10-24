from mymodule import encode, decode, compression_ratio


def test_encode_example():
    assert encode("WWWWBBBWW") == "4W3B2W"


def test_encode_no_repeats():
    assert encode("abc") == "1a1b1c"


def test_encode_empty():
    assert encode("") == ""


def test_encode_single_run():
    assert encode("zzzz") == "4z"


def test_encode_long_run():
    assert encode("xxxxxxxxxxxxy") == "12x1y"


def test_encode_spaces_and_case():
    assert encode("aA  b") == "1a1A2 1b"


def test_decode_example():
    assert decode("4W3B2W") == "WWWWBBBWW"


def test_decode_multi_digit():
    assert decode("12x1y") == "xxxxxxxxxxxxy"


def test_decode_empty():
    assert decode("") == ""


def test_round_trip():
    for text in ["hello", "aaabccddddd", "  !!  ", "Mississippi"]:
        assert decode(encode(text)) == text


def test_ratio_example():
    assert compression_ratio("WWWWBBBWW") == 0.67


def test_ratio_gets_bigger():
    assert compression_ratio("abc") == 2.0


def test_ratio_empty():
    assert compression_ratio("") == 0
