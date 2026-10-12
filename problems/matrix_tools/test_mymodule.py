import pytest

from mymodule import shape, identity, transpose, add, multiply


def test_shape():
    assert shape([[1, 2, 3], [4, 5, 6]]) == (2, 3)
    assert shape([[7]]) == (1, 1)
    assert shape([[1], [2], [3]]) == (3, 1)


def test_identity():
    assert identity(3) == [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    assert identity(1) == [[1]]


def test_identity_rows_are_separate():
    m = identity(3)

    m[0][1] = 99

    assert m[1][1] == 1
    assert m[2][1] == 0


def test_transpose():
    assert transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]


def test_transpose_square():
    assert transpose([[1, 2], [3, 4]]) == [[1, 3], [2, 4]]


def test_transpose_single_row():
    assert transpose([[1, 2, 3]]) == [[1], [2], [3]]


def test_transpose_twice_is_original():
    m = [[1, 2, 3], [4, 5, 6]]

    assert transpose(transpose(m)) == m


def test_add():
    assert add([[1, 2], [3, 4]], [[10, 20], [30, 40]]) == [[11, 22], [33, 44]]


def test_add_rectangular():
    assert add([[1, 2, 3]], [[1, 1, 1]]) == [[2, 3, 4]]


def test_add_shape_mismatch():
    with pytest.raises(ValueError):
        add([[1, 2]], [[1, 2], [3, 4]])

    with pytest.raises(ValueError):
        add([[1, 2]], [[1, 2, 3]])


def test_multiply_square():
    assert multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]) == [[19, 22], [43, 50]]


def test_multiply_rectangular():
    a = [[1, 2, 3], [4, 5, 6]]
    b = [[7, 8], [9, 10], [11, 12]]

    assert multiply(a, b) == [[58, 64], [139, 154]]


def test_multiply_row_by_column():
    assert multiply([[1, 2, 3]], [[4], [5], [6]]) == [[32]]
    assert multiply([[4], [5], [6]], [[1, 2, 3]]) == [
        [4, 8, 12],
        [5, 10, 15],
        [6, 12, 18],
    ]


def test_multiply_by_identity():
    m = [[2, -1], [0, 3]]

    assert multiply(m, identity(2)) == m
    assert multiply(identity(2), m) == m


def test_multiply_shape_mismatch():
    with pytest.raises(ValueError):
        multiply([[1, 2]], [[1, 2]])


def test_inputs_not_changed():
    a = [[1, 2], [3, 4]]
    b = [[5, 6], [7, 8]]

    transpose(a)
    add(a, b)
    multiply(a, b)

    assert a == [[1, 2], [3, 4]]
    assert b == [[5, 6], [7, 8]]


def test_results_are_new_lists():
    a = [[1, 2], [3, 4]]

    t = transpose(a)
    t[0][0] = 99

    assert a[0][0] == 1
