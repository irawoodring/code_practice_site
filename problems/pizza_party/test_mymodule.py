import ast
import inspect
import linecache
import math

import pytest

import mymodule
from mymodule import topping_combos, slice_orders, best_order

# Make sure inspect sees the latest version of mymodule.py on every run.
linecache.clearcache()


def as_set(list_of_lists):
    return sorted(tuple(x) for x in list_of_lists)


def test_combos_example():
    assert as_set(topping_combos(["ham", "olive"])) == as_set(
        [[], ["ham"], ["olive"], ["ham", "olive"]]
    )


def test_combos_empty():
    assert topping_combos([]) == [[]]


def test_combos_three():
    result = topping_combos(["a", "b", "c"])

    assert as_set(result) == as_set([
        [], ["a"], ["b"], ["c"],
        ["a", "b"], ["a", "c"], ["b", "c"],
        ["a", "b", "c"],
    ])


def test_combos_count_and_no_duplicates():
    toppings = ["ham", "olive", "onion", "pepper", "mushroom", "pineapple"]

    result = topping_combos(toppings)

    assert len(result) == 2 ** 6
    assert len(set(tuple(x) for x in result)) == 2 ** 6


def test_combos_keep_original_order():
    toppings = ["z", "a", "m"]

    for combo in topping_combos(toppings):
        positions = [toppings.index(t) for t in combo]
        assert positions == sorted(positions)


def test_combos_does_not_change_input():
    toppings = ["ham", "olive"]

    topping_combos(toppings)

    assert toppings == ["ham", "olive"]


def test_orders_example():
    assert as_set(slice_orders(["Ada", "Bo", "Cy"])) == as_set([
        ["Ada", "Bo", "Cy"], ["Ada", "Cy", "Bo"], ["Bo", "Ada", "Cy"],
        ["Bo", "Cy", "Ada"], ["Cy", "Ada", "Bo"], ["Cy", "Bo", "Ada"],
    ])


def test_orders_small():
    assert slice_orders([]) == [[]]
    assert slice_orders(["Solo"]) == [["Solo"]]


def test_orders_count_and_no_duplicates():
    friends = ["A", "B", "C", "D", "E", "F"]

    result = slice_orders(friends)

    assert len(result) == math.factorial(6)
    assert len(set(tuple(x) for x in result)) == math.factorial(6)
    assert all(sorted(order) == friends for order in result)


def test_orders_does_not_change_input():
    friends = ["Ada", "Bo"]

    slice_orders(friends)

    assert friends == ["Ada", "Bo"]


def test_best_order_examples():
    assert best_order([8, 6, 5, 3], 12) == 11
    assert best_order([8, 6, 5, 3], 30) == 22
    assert best_order([20, 30], 10) == 0


def test_best_order_exact():
    assert best_order([7, 4, 9, 2], 13) == 13


def test_best_order_greedy_fails():
    # Taking the biggest item first (9) leaves only 1 dollar.
    # The best choice is 5 + 5.
    assert best_order([9, 5, 5], 10) == 10


def test_best_order_empty():
    assert best_order([], 50) == 0
    assert best_order([5, 10], 0) == 0


def test_best_order_bigger_menu():
    prices = [31, 17, 23, 9, 14, 41, 6, 28, 19, 11, 37, 25, 8, 13, 22]

    assert best_order(prices, 100) == 100
    assert best_order(prices, 5) == 0
    assert best_order(prices, 7) == 6


def test_does_not_use_itertools():
    tree = ast.parse(inspect.getsource(mymodule))

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names = [alias.name for alias in node.names]
        elif isinstance(node, ast.ImportFrom):
            names = [node.module]
        else:
            continue
        assert "itertools" not in names, "solve these with recursion instead of itertools"
