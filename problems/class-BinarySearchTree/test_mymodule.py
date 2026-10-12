import random

import pytest

from mymodule import TreeNode, BinarySearchTree


def build(values):
    tree = BinarySearchTree()
    for v in values:
        tree.insert(v)
    return tree


EXAMPLE = [8, 3, 10, 1, 6, 14]


def test_tree_node():
    node = TreeNode(5)

    assert node.value == 5
    assert node.left is None
    assert node.right is None


def test_empty_tree():
    tree = BinarySearchTree()

    assert tree.root is None
    assert len(tree) == 0
    assert tree.in_order() == []
    assert tree.height() == -1
    assert 5 not in tree


def test_insert_structure():
    tree = build(EXAMPLE)

    assert tree.root.value == 8
    assert tree.root.left.value == 3
    assert tree.root.right.value == 10
    assert tree.root.left.left.value == 1
    assert tree.root.left.right.value == 6
    assert tree.root.right.right.value == 14
    assert tree.root.right.left is None


def test_in_order():
    assert build(EXAMPLE).in_order() == [1, 3, 6, 8, 10, 14]


def test_in_order_random():
    rng = random.Random(42)
    values = rng.sample(range(1000), 200)

    assert build(values).in_order() == sorted(values)


def test_no_duplicates():
    tree = build([5, 3, 5, 8, 3])

    assert tree.in_order() == [3, 5, 8]
    assert len(tree) == 3


def test_contains():
    tree = build(EXAMPLE)

    for v in EXAMPLE:
        assert v in tree

    for v in [0, 2, 7, 9, 15]:
        assert v not in tree


def test_len():
    assert len(build(EXAMPLE)) == 6


def test_min_max():
    tree = build(EXAMPLE)

    assert tree.min() == 1
    assert tree.max() == 14


def test_min_max_empty():
    with pytest.raises(ValueError):
        BinarySearchTree().min()

    with pytest.raises(ValueError):
        BinarySearchTree().max()


def test_height():
    assert build([5]).height() == 0
    assert build(EXAMPLE).height() == 2
    assert build([1, 2, 3, 4]).height() == 3


def test_strings():
    tree = build(["mango", "apple", "zucchini", "kiwi"])

    assert tree.in_order() == ["apple", "kiwi", "mango", "zucchini"]
    assert "kiwi" in tree


def test_contains_only_follows_one_path():
    # A tree shaped like a long chain. If __contains__ follows the
    # BST rule it only looks at a few nodes.
    class CountingInt(int):
        comparisons = 0

        def __lt__(self, other):
            CountingInt.comparisons += 1
            return int(self) < int(other)

        def __gt__(self, other):
            CountingInt.comparisons += 1
            return int(self) > int(other)

        def __eq__(self, other):
            CountingInt.comparisons += 1
            return int(self) == int(other)

        __hash__ = int.__hash__

    rng = random.Random(7)
    values = rng.sample(range(100_000), 2000)
    tree = build(values)

    CountingInt.comparisons = 0
    assert CountingInt(values[-1]) in tree
    assert CountingInt.comparisons < 200


def test_remove_leaf():
    tree = build(EXAMPLE)

    tree.remove(1)

    assert tree.in_order() == [3, 6, 8, 10, 14]
    assert tree.root.left.left is None


def test_remove_one_child():
    tree = build(EXAMPLE)

    tree.remove(10)

    assert tree.in_order() == [1, 3, 6, 8, 14]
    assert tree.root.right.value == 14


def test_remove_two_children():
    tree = build(EXAMPLE)

    tree.remove(3)

    assert tree.in_order() == [1, 6, 8, 10, 14]
    assert tree.root.left.value == 6


def test_remove_root():
    tree = build(EXAMPLE)

    tree.remove(8)

    assert tree.in_order() == [1, 3, 6, 10, 14]
    assert tree.root.value == 10


def test_remove_only_node():
    tree = build([5])

    tree.remove(5)

    assert tree.root is None
    assert len(tree) == 0


def test_remove_missing():
    tree = build(EXAMPLE)

    with pytest.raises(ValueError):
        tree.remove(7)

    with pytest.raises(ValueError):
        BinarySearchTree().remove(1)


def test_remove_many_random():
    rng = random.Random(99)
    values = rng.sample(range(500), 100)
    tree = build(values)
    remaining = set(values)

    for v in rng.sample(values, 60):
        tree.remove(v)
        remaining.discard(v)
        assert tree.in_order() == sorted(remaining)

    assert len(tree) == 40
