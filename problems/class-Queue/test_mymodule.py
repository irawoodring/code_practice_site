import pytest

from mymodule import Queue, hot_potato


def test_new_queue_is_empty():
    q = Queue()

    assert q.is_empty() is True
    assert len(q) == 0


def test_enqueue_and_len():
    q = Queue()

    q.enqueue("Ada")
    q.enqueue("Grace")

    assert len(q) == 2
    assert q.is_empty() is False


def test_first_in_first_out():
    q = Queue()

    for i in range(5):
        q.enqueue(i)

    assert [q.dequeue() for _ in range(5)] == [0, 1, 2, 3, 4]
    assert q.is_empty() is True


def test_peek_does_not_remove():
    q = Queue()
    q.enqueue("Ada")
    q.enqueue("Grace")

    assert q.peek() == "Ada"
    assert q.peek() == "Ada"
    assert len(q) == 2


def test_mixed_operations():
    q = Queue()
    q.enqueue(1)
    q.enqueue(2)
    q.dequeue()
    q.enqueue(3)

    assert q.dequeue() == 2
    assert q.dequeue() == 3


def test_dequeue_empty():
    with pytest.raises(IndexError):
        Queue().dequeue()


def test_peek_empty():
    with pytest.raises(IndexError):
        Queue().peek()


def test_str():
    q = Queue()
    for name in ["Ada", "Grace", "Linus"]:
        q.enqueue(name)

    assert str(q) == "[front] Ada, Grace, Linus [back]"


def test_str_empty():
    assert str(Queue()) == "[front] [back]"


def test_separate_queues():
    a = Queue()
    b = Queue()

    a.enqueue(1)

    assert len(a) == 1
    assert len(b) == 0


def test_hot_potato_example():
    assert hot_potato(["Ada", "Bo", "Cy", "Di"], 2) == ["Cy", "Bo", "Di", "Ada"]


def test_hot_potato_zero_passes():
    assert hot_potato(["Ada", "Bo", "Cy"], 0) == ["Ada", "Bo", "Cy"]


def test_hot_potato_one_pass():
    assert hot_potato(["A", "B", "C", "D", "E"], 1) == ["B", "D", "A", "E", "C"]


def test_hot_potato_many_passes():
    names = ["Bill", "David", "Susan", "Jane", "Kent", "Brad"]

    result = hot_potato(names, 7)

    assert result == ["David", "Kent", "Jane", "Bill", "Brad", "Susan"]


def test_hot_potato_one_player():
    assert hot_potato(["Solo"], 5) == ["Solo"]


def test_hot_potato_empty():
    with pytest.raises(ValueError):
        hot_potato([], 3)


def test_hot_potato_does_not_change_names():
    names = ["Ada", "Bo", "Cy"]

    hot_potato(names, 1)

    assert names == ["Ada", "Bo", "Cy"]
