import pytest

from mymodule import guesses, binary_search


class WatchedList(list):
    """A list that counts how many items are looked at and forbids scanning."""

    def __init__(self, *args):
        super().__init__(*args)
        self.looks = 0

    def __getitem__(self, i):
        if isinstance(i, slice):
            raise AssertionError("don't slice the list; keep track of low and high instead")
        self.looks += 1
        return super().__getitem__(i)

    def __iter__(self):
        raise AssertionError("don't loop over every item; use binary search")

    def __contains__(self, item):
        raise AssertionError("don't use 'in'; use binary search")

    def index(self, *args):
        raise AssertionError("don't use .index(); use binary search")

    def count(self, *args):
        raise AssertionError("don't use .count(); use binary search")


def test_guesses_example():
    assert guesses(37, 1, 100) == [50, 25, 37]


def test_guesses_first_try():
    assert guesses(50, 1, 100) == [50]


def test_guesses_low_end():
    assert guesses(1, 1, 10) == [5, 2, 1]


def test_guesses_high_end():
    assert guesses(10, 1, 10) == [5, 8, 9, 10]


def test_guesses_single_option():
    assert guesses(7, 7, 7) == [7]


def test_guesses_never_more_than_20():
    for secret in [1, 2, 499_999, 777_777, 1_000_000]:
        result = guesses(secret, 1, 1_000_000)
        assert result[-1] == secret
        assert len(result) <= 20


def test_guesses_out_of_range():
    with pytest.raises(ValueError):
        guesses(0, 1, 100)

    with pytest.raises(ValueError):
        guesses(101, 1, 100)


def test_binary_search_found():
    items = [2, 5, 8, 12, 16, 23, 38]

    assert binary_search(items, 23) == 5
    assert binary_search(items, 2) == 0
    assert binary_search(items, 38) == 6


def test_binary_search_every_item():
    items = [2, 5, 8, 12, 16, 23, 38]

    for i, value in enumerate(items):
        assert binary_search(items, value) == i


def test_binary_search_not_found():
    items = [2, 5, 8, 12, 16, 23, 38]

    assert binary_search(items, 7) == -1
    assert binary_search(items, 1) == -1
    assert binary_search(items, 99) == -1


def test_binary_search_empty():
    assert binary_search([], 5) == -1


def test_binary_search_strings():
    words = ["apple", "banana", "cherry", "date", "fig"]

    assert binary_search(words, "date") == 3
    assert binary_search(words, "grape") == -1


def test_binary_search_is_fast():
    items = WatchedList(range(0, 2_000_000, 2))

    assert binary_search(items, 1_234_566) == 617_283
    assert items.looks <= 60


def test_binary_search_is_fast_when_missing():
    items = WatchedList(range(0, 2_000_000, 2))

    assert binary_search(items, 1_234_567) == -1
    assert items.looks <= 60
