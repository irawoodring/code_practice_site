from mymodule import count_mines, neighbors, hints

FIELD = [
    "*...",
    "..*.",
    "....",
]


def test_count_mines_example():
    assert count_mines(FIELD) == 2


def test_count_mines_none():
    assert count_mines(["...", "..."]) == 0


def test_count_mines_all():
    assert count_mines(["**", "**"]) == 4


def test_neighbors_two():
    assert neighbors(FIELD, 0, 1) == 2


def test_neighbors_zero_corner():
    assert neighbors(FIELD, 2, 0) == 0


def test_neighbors_diagonal():
    assert neighbors(FIELD, 1, 1) == 2


def test_neighbors_right_edge():
    assert neighbors(FIELD, 0, 3) == 1


def test_neighbors_does_not_count_itself():
    assert neighbors(["*"], 0, 0) == 0


def test_neighbors_surrounded():
    assert neighbors(["***", "*.*", "***"], 1, 1) == 8


def test_hints_example():
    assert hints(FIELD) == ["*211", "12*1", "0111"]


def test_hints_no_mines():
    assert hints(["...", "..."]) == ["000", "000"]


def test_hints_single_row():
    assert hints([".*.*."]) == ["1*2*1"]


def test_hints_single_column():
    assert hints(["*", ".", ".", "*"]) == ["*", "1", "1", "*"]


def test_hints_does_not_change_field():
    field = list(FIELD)
    hints(field)
    assert field == FIELD
