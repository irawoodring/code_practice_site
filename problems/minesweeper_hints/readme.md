# Minesweeper Hints

## The Story

In Minesweeper, every safe square shows how many mines are hidden in the **8 squares around it** (up, down, left, right, and the four diagonals). You're writing the code that fills in those numbers.

The field is a **list of strings**, one per row. `"*"` is a mine and `"."` is a safe square:

```python
field = [
    "*...",
    "..*.",
    "....",
]
```

You can reach a square with `field[row][col]`.

---

## Your Mission

### 1. `count_mines(field)`

Return the total number of mines in the field.

```python
count_mines(field)   # 2
```

### 2. `neighbors(field, row, col)`

Return how many mines are in the squares **touching** `(row, col)`. Don't count the square itself, and be careful at the edges: there are no squares outside the field!

```python
neighbors(field, 0, 1)   # 2
neighbors(field, 2, 0)   # 0
```

### 3. `hints(field)`

Return a new field (a list of strings) where every safe square is replaced by its neighbor count, and mines stay as `"*"`:

```python
hints(field)
# ["*211",
#  "12*1",
#  "0111"]
```

**Hint:** For `neighbors`, loop over row changes `-1, 0, 1` and column changes `-1, 0, 1` (skip `0, 0`). Before looking at a square, check that its row and column are inside the field.
