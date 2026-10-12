import pytest

from mymodule import winner, is_full, game_status, valid_move


EXAMPLE = [
    ["X", "O", "X"],
    [" ", "X", "O"],
    ["O", " ", "X"],
]

EMPTY = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
]

DRAW = [
    ["X", "O", "X"],
    ["X", "O", "O"],
    ["O", "X", "X"],
]


def test_winner_main_diagonal():
    assert winner(EXAMPLE) == "X"


def test_winner_other_diagonal():
    board = [
        ["X", "X", "O"],
        [" ", "O", " "],
        ["O", " ", "X"],
    ]
    assert winner(board) == "O"


def test_winner_each_row():
    for r in range(3):
        board = [[" "] * 3 for _ in range(3)]
        board[r] = ["O", "O", "O"]
        assert winner(board) == "O"


def test_winner_each_column():
    for c in range(3):
        board = [[" "] * 3 for _ in range(3)]
        for r in range(3):
            board[r][c] = "X"
        assert winner(board) == "X"


def test_no_winner_empty():
    assert winner(EMPTY) is None


def test_no_winner_draw():
    assert winner(DRAW) is None


def test_three_empty_squares_is_not_a_win():
    board = [
        ["X", "O", "X"],
        [" ", " ", " "],
        ["O", "X", "O"],
    ]
    assert winner(board) is None


def test_is_full():
    assert is_full(DRAW) is True
    assert is_full(EMPTY) is False
    assert is_full(EXAMPLE) is False


def test_status_x_wins():
    assert game_status(EXAMPLE) == "X wins"


def test_status_o_wins():
    board = [
        ["O", "X", "X"],
        ["O", "X", " "],
        ["O", " ", " "],
    ]
    assert game_status(board) == "O wins"


def test_status_win_on_full_board():
    board = [
        ["X", "O", "X"],
        ["O", "X", "O"],
        ["O", "X", "X"],
    ]
    assert game_status(board) == "X wins"


def test_status_draw():
    assert game_status(DRAW) == "Draw"


def test_status_in_progress():
    assert game_status(EMPTY) == "In progress"


def test_valid_move():
    assert valid_move(EXAMPLE, 1, 0) is True
    assert valid_move(EXAMPLE, 2, 1) is True


def test_valid_move_taken():
    assert valid_move(EXAMPLE, 0, 0) is False


def test_valid_move_off_board():
    assert valid_move(EXAMPLE, 3, 1) is False
    assert valid_move(EXAMPLE, 1, -1) is False


def test_judge_does_not_change_board():
    board = [row[:] for row in EXAMPLE]

    winner(board)
    is_full(board)
    game_status(board)
    valid_move(board, 1, 0)

    assert board == EXAMPLE
