import ast
import inspect
import linecache

import pytest

import mymodule
from mymodule import HashMap

# Make sure inspect sees the latest version of mymodule.py on every run.
linecache.clearcache()


def test_new_map():
    m = HashMap()

    assert len(m) == 0
    assert m.capacity == 8
    assert m.keys() == []


def test_custom_capacity():
    assert HashMap(32).capacity == 32


def test_capacity_read_only():
    with pytest.raises(AttributeError):
        HashMap().capacity = 100


def test_put_and_get():
    m = HashMap()

    m.put("apple", 3)
    m.put("banana", 5)

    assert m.get("apple") == 3
    assert m.get("banana") == 5
    assert len(m) == 2


def test_put_replaces():
    m = HashMap()

    m.put("apple", 3)
    m.put("apple", 10)

    assert m.get("apple") == 10
    assert len(m) == 1


def test_get_missing():
    m = HashMap()
    m.put("apple", 3)

    with pytest.raises(KeyError):
        m.get("pear")


def test_contains():
    m = HashMap()
    m.put("apple", 3)

    assert "apple" in m
    assert "pear" not in m


def test_none_value():
    m = HashMap()
    m.put("nothing", None)

    assert "nothing" in m
    assert m.get("nothing") is None


def test_collisions():
    # With 8 buckets, the ints 1, 9, and 17 all land in bucket 1.
    m = HashMap(8)

    m.put(1, "one")
    m.put(9, "nine")
    m.put(17, "seventeen")

    assert m.get(1) == "one"
    assert m.get(9) == "nine"
    assert m.get(17) == "seventeen"

    m.remove(9)

    assert m.get(1) == "one"
    assert m.get(17) == "seventeen"
    assert 9 not in m


def test_remove():
    m = HashMap()
    m.put("apple", 3)
    m.put("banana", 5)

    m.remove("apple")

    assert "apple" not in m
    assert m.get("banana") == 5
    assert len(m) == 1


def test_remove_missing():
    with pytest.raises(KeyError):
        HashMap().remove("ghost")


def test_keys():
    m = HashMap()
    for word in ["red", "green", "blue"]:
        m.put(word, len(word))

    assert sorted(m.keys()) == ["blue", "green", "red"]


def test_tuple_keys():
    m = HashMap()
    m.put((0, 0), "origin")

    assert m.get((0, 0)) == "origin"


def test_no_resize_at_exactly_075():
    m = HashMap()

    for i in range(6):
        m.put(i, i)

    assert m.capacity == 8


def test_resize():
    m = HashMap()

    for i in range(7):
        m.put(i, i)

    assert m.capacity == 16


def test_replacing_does_not_resize():
    m = HashMap()

    for i in range(6):
        m.put(i, i)
    for i in range(6):
        m.put(i, i * 10)

    assert m.capacity == 8
    assert len(m) == 6


def test_everything_survives_resizes():
    m = HashMap()

    for i in range(1000):
        m.put(f"key{i}", i)

    assert len(m) == 1000
    assert m.capacity == 2048
    assert all(m.get(f"key{i}") == i for i in range(1000))


def test_many_removes():
    m = HashMap()
    for i in range(200):
        m.put(i, str(i))

    for i in range(0, 200, 2):
        m.remove(i)

    assert len(m) == 100
    assert sorted(m.keys()) == list(range(1, 200, 2))


def test_no_dict_or_set():
    tree = ast.parse(inspect.getsource(mymodule))

    for node in ast.walk(tree):
        if isinstance(node, (ast.Dict, ast.DictComp, ast.Set, ast.SetComp)):
            pytest.fail("don't use dict or set literals; build the hash table from lists")
        if isinstance(node, ast.Name) and node.id in ("dict", "set"):
            pytest.fail("don't use dict() or set(); build the hash table from lists")
