import ast
import inspect
import linecache

import pytest

from mymodule import factorial, sum_digits, reverse, count, flatten

# Make sure inspect sees the latest version of mymodule.py on every run.
linecache.clearcache()


def test_factorial():
    assert factorial(0) == 1
    assert factorial(1) == 1
    assert factorial(5) == 120
    assert factorial(10) == 3628800


def test_sum_digits():
    assert sum_digits(4096) == 19
    assert sum_digits(7) == 7
    assert sum_digits(0) == 0
    assert sum_digits(1111111111) == 10


def test_reverse():
    assert reverse("stressed") == "desserts"
    assert reverse("a") == "a"
    assert reverse("") == ""


def test_reverse_palindrome():
    assert reverse("racecar") == "racecar"


def test_count():
    assert count([1, 2, 1, 3, 1], 1) == 3
    assert count([1, 2, 3], 4) == 0
    assert count([], 1) == 0
    assert count(["a", "b", "a"], "a") == 2


def test_flatten():
    assert flatten([1, [2, 3], [[4], 5]]) == [1, 2, 3, 4, 5]


def test_flatten_already_flat():
    assert flatten([1, 2, 3]) == [1, 2, 3]


def test_flatten_empty():
    assert flatten([]) == []
    assert flatten([[], [[]]]) == []


def test_flatten_deep():
    assert flatten([[[["deep"]]], "shallow"]) == ["deep", "shallow"]


def test_flatten_does_not_change_input():
    nested = [1, [2, [3]]]

    flatten(nested)

    assert nested == [1, [2, [3]]]


LOOP_NODES = (ast.For, ast.While, ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)


@pytest.mark.parametrize("func", [factorial, sum_digits, reverse, count, flatten])
def test_uses_recursion_not_loops(func):
    tree = ast.parse(inspect.getsource(func))

    loops = [node for node in ast.walk(tree) if isinstance(node, LOOP_NODES)]
    assert not loops, f"{func.__name__} should not use loops or comprehensions"

    calls = [
        node for node in ast.walk(tree)
        if isinstance(node, ast.Call)
        and isinstance(node.func, ast.Name)
        and node.func.id == func.__name__
    ]
    assert calls, f"{func.__name__} should call itself"


def test_reverse_no_slicing_shortcut():
    tree = ast.parse(inspect.getsource(reverse))

    for node in ast.walk(tree):
        if isinstance(node, ast.Slice) and node.step is not None:
            pytest.fail("reverse should not use a [::-1] slice")
