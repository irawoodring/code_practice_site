import pytest

from mymodule import add_loot, hoard_value, most_common


def test_add_loot_example():
    hoard = {"gold coin": 500, "ruby": 12}

    result = add_loot(hoard, ["ruby", "gold coin", "ruby", "silver cup"])

    assert result == {"gold coin": 501, "ruby": 14, "silver cup": 1}


def test_add_loot_does_not_change_original():
    hoard = {"gold coin": 500}

    add_loot(hoard, ["gold coin", "ruby"])

    assert hoard == {"gold coin": 500}


def test_add_loot_empty_hoard():
    assert add_loot({}, ["crown", "crown"]) == {"crown": 2}


def test_add_loot_no_loot():
    assert add_loot({"ruby": 1}, []) == {"ruby": 1}


def test_hoard_value_example():
    hoard = {"gold coin": 10, "ruby": 2, "old boot": 3}
    prices = {"gold coin": 1, "ruby": 50}

    assert hoard_value(hoard, prices) == 110


def test_hoard_value_empty():
    assert hoard_value({}, {"ruby": 50}) == 0


def test_hoard_value_all_priced():
    hoard = {"crown": 2, "sword": 1}
    prices = {"crown": 1000, "sword": 250, "shield": 99}

    assert hoard_value(hoard, prices) == 2250


def test_most_common():
    assert most_common({"gold coin": 500, "ruby": 12}) == "gold coin"


def test_most_common_not_first():
    assert most_common({"ruby": 4, "crown": 1, "pearl": 9}) == "pearl"


def test_most_common_tie():
    assert most_common({"ruby": 3, "emerald": 3}) == "emerald"


def test_most_common_tie_with_others():
    assert most_common({"zircon": 7, "amber": 2, "opal": 7}) == "opal"


def test_most_common_empty():
    assert most_common({}) is None
