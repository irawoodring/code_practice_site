import pytest

from mymodule import fizzbuzz, custom_fizzbuzz


def test_fizzbuzz_15():
    assert fizzbuzz(15) == [
        "1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz",
        "11", "Fizz", "13", "14", "FizzBuzz",
    ]


def test_fizzbuzz_small():
    assert fizzbuzz(1) == ["1"]
    assert fizzbuzz(3) == ["1", "2", "Fizz"]


def test_fizzbuzz_zero_and_negative():
    assert fizzbuzz(0) == []
    assert fizzbuzz(-4) == []


def test_fizzbuzz_length():
    assert len(fizzbuzz(100)) == 100


def test_fizzbuzz_later_values():
    result = fizzbuzz(100)

    assert result[29] == "FizzBuzz"
    assert result[98] == "Fizz"
    assert result[99] == "Buzz"
    assert result[96] == "97"


def test_custom_example():
    assert custom_fizzbuzz(7, [(2, "Zip"), (3, "Zap")]) == [
        "1", "Zip", "Zap", "Zip", "5", "ZipZap", "7",
    ]


def test_custom_matches_fizzbuzz():
    assert custom_fizzbuzz(50, [(3, "Fizz"), (5, "Buzz")]) == fizzbuzz(50)


def test_custom_rule_order_matters():
    assert custom_fizzbuzz(6, [(3, "Zap"), (2, "Zip")])[5] == "ZapZip"


def test_custom_three_rules():
    rules = [(3, "Fizz"), (5, "Buzz"), (7, "Bazz")]

    result = custom_fizzbuzz(105, rules)

    assert result[20] == "FizzBazz"
    assert result[34] == "BuzzBazz"
    assert result[104] == "FizzBuzzBazz"


def test_custom_no_rules():
    assert custom_fizzbuzz(3, []) == ["1", "2", "3"]
