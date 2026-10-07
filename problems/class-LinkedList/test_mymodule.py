import pytest

from mymodule import Node, LinkedList


def test_node():
    node = Node("coal")

    assert node.value == "coal"
    assert node.next is None


def test_empty_list():
    train = LinkedList()

    assert train.head is None
    assert len(train) == 0
    assert train.to_list() == []
    assert str(train) == ""


def test_append_one():
    train = LinkedList()
    train.append("coal")

    assert isinstance(train.head, Node)
    assert train.head.value == "coal"
    assert train.head.next is None


def test_append_links_nodes():
    train = LinkedList()
    train.append(1)
    train.append(2)
    train.append(3)

    assert train.head.value == 1
    assert train.head.next.value == 2
    assert train.head.next.next.value == 3
    assert train.head.next.next.next is None


def test_prepend():
    train = LinkedList()
    train.append("coal")
    train.prepend("engine")

    assert train.head.value == "engine"
    assert train.head.next.value == "coal"


def test_prepend_empty():
    train = LinkedList()
    train.prepend("engine")

    assert train.to_list() == ["engine"]


def test_to_list_and_len():
    train = LinkedList()
    for v in [5, 10, 15, 20]:
        train.append(v)

    assert train.to_list() == [5, 10, 15, 20]
    assert len(train) == 4


def test_contains():
    train = LinkedList()
    train.append("coal")
    train.append("lumber")

    assert "coal" in train
    assert "lumber" in train
    assert "cattle" not in train


def test_str():
    train = LinkedList()
    train.append("coal")
    train.append("lumber")
    train.prepend("engine")

    assert str(train) == "engine -> coal -> lumber"


def test_str_numbers():
    train = LinkedList()
    train.append(1)
    train.append(2)

    assert str(train) == "1 -> 2"


def test_remove_middle():
    train = LinkedList()
    for v in ["engine", "coal", "lumber"]:
        train.append(v)

    train.remove("coal")

    assert train.to_list() == ["engine", "lumber"]
    assert train.head.next.value == "lumber"


def test_remove_head():
    train = LinkedList()
    for v in ["engine", "coal", "lumber"]:
        train.append(v)

    train.remove("engine")

    assert train.head.value == "coal"
    assert len(train) == 2


def test_remove_last():
    train = LinkedList()
    for v in ["engine", "coal", "lumber"]:
        train.append(v)

    train.remove("lumber")

    assert train.to_list() == ["engine", "coal"]

    train.append("caboose")

    assert train.to_list() == ["engine", "coal", "caboose"]


def test_remove_only_first_match():
    train = LinkedList()
    for v in [1, 2, 1, 2]:
        train.append(v)

    train.remove(2)

    assert train.to_list() == [1, 1, 2]


def test_remove_only_node():
    train = LinkedList()
    train.append("solo")

    train.remove("solo")

    assert train.head is None
    assert len(train) == 0


def test_remove_missing():
    train = LinkedList()
    train.append("coal")

    with pytest.raises(ValueError):
        train.remove("gold")


def test_remove_from_empty():
    with pytest.raises(ValueError):
        LinkedList().remove("anything")
