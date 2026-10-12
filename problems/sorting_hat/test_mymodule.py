import ast
import inspect
import linecache
import random

import pytest

from mymodule import is_sorted, selection_sort, insertion_sort, merge

# Make sure inspect sees the latest version of mymodule.py on every run.
linecache.clearcache()


def test_is_sorted_true():
    assert is_sorted([1, 2, 2, 5]) is True
    assert is_sorted(["a", "b", "c"]) is True


def test_is_sorted_false():
    assert is_sorted([3, 1, 2]) is False
    assert is_sorted([1, 2, 3, 0]) is False


def test_is_sorted_small():
    assert is_sorted([]) is True
    assert is_sorted([42]) is True


@pytest.mark.parametrize("sort", [selection_sort, insertion_sort])
def test_sort_example(sort):
    assert sort([29, 10, 14, 37, 13]) == [10, 13, 14, 29, 37]


@pytest.mark.parametrize("sort", [selection_sort, insertion_sort])
def test_sort_strings(sort):
    assert sort(["pear", "apple", "fig"]) == ["apple", "fig", "pear"]


@pytest.mark.parametrize("sort", [selection_sort, insertion_sort])
def test_sort_duplicates_and_negatives(sort):
    assert sort([3, -1, 3, 0, -1]) == [-1, -1, 0, 3, 3]


@pytest.mark.parametrize("sort", [selection_sort, insertion_sort])
def test_sort_small(sort):
    assert sort([]) == []
    assert sort([7]) == [7]


@pytest.mark.parametrize("sort", [selection_sort, insertion_sort])
def test_sort_already_sorted_and_reversed(sort):
    assert sort([1, 2, 3, 4]) == [1, 2, 3, 4]
    assert sort([4, 3, 2, 1]) == [1, 2, 3, 4]


@pytest.mark.parametrize("sort", [selection_sort, insertion_sort])
def test_sort_random(sort):
    rng = random.Random(1234)
    for _ in range(20):
        items = [rng.randint(-50, 50) for _ in range(rng.randint(0, 30))]
        assert sort(items) == sorted(items)


@pytest.mark.parametrize("sort", [selection_sort, insertion_sort])
def test_sort_does_not_change_input(sort):
    items = [5, 3, 1, 4]

    result = sort(items)

    assert items == [5, 3, 1, 4]
    assert result is not items


def test_merge_example():
    assert merge([1, 4, 9], [2, 3, 10, 11]) == [1, 2, 3, 4, 9, 10, 11]


def test_merge_with_empty():
    assert merge([], [1, 2]) == [1, 2]
    assert merge([1, 2], []) == [1, 2]
    assert merge([], []) == []


def test_merge_one_side_all_smaller():
    assert merge([1, 2, 3], [4, 5, 6]) == [1, 2, 3, 4, 5, 6]
    assert merge([4, 5, 6], [1, 2, 3]) == [1, 2, 3, 4, 5, 6]


def test_merge_duplicates():
    assert merge([1, 3, 3], [3, 4]) == [1, 3, 3, 3, 4]


def test_merge_does_not_change_inputs():
    left = [1, 4]
    right = [2, 3]

    merge(left, right)

    assert left == [1, 4]
    assert right == [2, 3]


@pytest.mark.parametrize("func", [is_sorted, selection_sort, insertion_sort, merge])
def test_no_builtin_sorting(func):
    tree = ast.parse(inspect.getsource(func))

    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            f = node.func
            if isinstance(f, ast.Name) and f.id == "sorted":
                pytest.fail(f"{func.__name__} should not use sorted()")
            if isinstance(f, ast.Attribute) and f.attr == "sort":
                pytest.fail(f"{func.__name__} should not use .sort()")
