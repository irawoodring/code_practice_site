import pytest

from mymodule import Stack


def test_new_stack_is_empty():
    s = Stack()

    assert s.is_empty() is True
    assert len(s) == 0


def test_push_and_len():
    s = Stack()

    s.push(1)
    s.push(2)

    assert len(s) == 2
    assert s.is_empty() is False


def test_peek_does_not_remove():
    s = Stack()
    s.push("pancake")
    s.push("waffle")

    assert s.peek() == "waffle"
    assert s.peek() == "waffle"
    assert len(s) == 2


def test_pop_returns_last_pushed():
    s = Stack()
    s.push("pancake")
    s.push("waffle")

    assert s.pop() == "waffle"
    assert s.pop() == "pancake"
    assert s.is_empty() is True


def test_last_in_first_out():
    s = Stack()

    for i in range(5):
        s.push(i)

    assert [s.pop() for _ in range(5)] == [4, 3, 2, 1, 0]


def test_pop_empty():
    with pytest.raises(IndexError):
        Stack().pop()


def test_peek_empty():
    with pytest.raises(IndexError):
        Stack().peek()


def test_pop_after_emptied():
    s = Stack()
    s.push(1)
    s.pop()

    with pytest.raises(IndexError):
        s.pop()


def test_str():
    s = Stack()
    s.push(1)
    s.push(2)
    s.push(3)

    assert str(s) == "[bottom] 1, 2, 3 [top]"


def test_str_empty():
    assert str(Stack()) == "[bottom] [top]"


def test_str_single():
    s = Stack()
    s.push("only")

    assert str(s) == "[bottom] only [top]"


def test_separate_stacks():
    a = Stack()
    b = Stack()

    a.push(1)

    assert len(a) == 1
    assert len(b) == 0


def test_stack_holds_any_type():
    s = Stack()
    s.push([1, 2])
    s.push(None)

    assert s.pop() is None
    assert s.pop() == [1, 2]
