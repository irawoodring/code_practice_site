# Tic-Tac-Toe Judge

You've been hired as the official judge of the Tic-Tac-Toe World Championship. Your job is to look at a board and decide what's going on.

A board is a **list of 3 rows**, and each row is a list of 3 strings. Each square is `"X"`, `"O"`, or `" "` (a single space for an empty square):

```python
board = [
    ["X", "O", "X"],
    [" ", "X", "O"],
    ["O", " ", "X"],
]
```

You get to a square with `board[row][col]`. For example, `board[1][2]` is `"O"`.

## Your Mission

### 1. `winner(board)`

Return `"X"` or `"O"` if that player has three in a row: across a **row**, down a **column**, or along either **diagonal**. If nobody has won, return `None`.

For the board above, `winner(board)` returns `"X"` (the diagonal from top-left to bottom-right).

You may assume that at most one player has three in a row.

### 2. `is_full(board)`

Return `True` if there are no empty squares left, otherwise `False`.

### 3. `game_status(board)`

Return one of these strings:

* `"X wins"` or `"O wins"` if someone has won
* `"Draw"` if nobody has won and the board is full
* `"In progress"` otherwise

### 4. `valid_move(board, row, col)`

Return `True` if `row` and `col` are both between `0` and `2` **and** that square is empty. Otherwise return `False`.

```python
valid_move(board, 1, 0)   # True
valid_move(board, 0, 0)   # False (taken)
valid_move(board, 3, 1)   # False (off the board)
```

**Hint:** Checking for a winner gets much shorter if you first build a list of all 8 possible lines (3 rows, 3 columns, 2 diagonals).
