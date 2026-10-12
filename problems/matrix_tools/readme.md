# Matrix Tools

A **matrix** is a grid of numbers. In Python we can store one as a **list of rows**, where each row is a list of numbers:

```python
m = [
    [1, 2, 3],
    [4, 5, 6],
]
```

This matrix has 2 rows and 3 columns. `m[1][2]` is `6` (row 1, column 2).

## Your Mission

Write the five functions below. None of them should change the matrices they are given. Always build and return a **new** matrix.

You may assume every matrix has at least one row, and that all of its rows are the same length.

### 1. `shape(m)`

Return a tuple `(rows, columns)`.

```python
shape([[1, 2, 3], [4, 5, 6]])   # (2, 3)
```

### 2. `identity(n)`

Return an `n` by `n` matrix with `1`s on the diagonal (where the row equals the column) and `0`s everywhere else.

```python
identity(3)
# [[1, 0, 0],
#  [0, 1, 0],
#  [0, 0, 1]]
```

### 3. `transpose(m)`

Flip the matrix over its diagonal, so row `r`, column `c` moves to row `c`, column `r`. The rows become the columns.

```python
transpose([[1, 2, 3], [4, 5, 6]])
# [[1, 4],
#  [2, 5],
#  [3, 6]]
```

### 4. `add(a, b)`

Add two matrices by adding the numbers in matching positions. If the matrices aren't the same shape, raise a `ValueError`.

```python
add([[1, 2], [3, 4]], [[10, 20], [30, 40]])
# [[11, 22], [33, 44]]
```

### 5. `multiply(a, b)`

In matrix multiplication, the number at row `r`, column `c` of the answer comes from row `r` of `a` and column `c` of `b`. Multiply their matching numbers and add up the results:

```python
multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]])
# [[1*5 + 2*7, 1*6 + 2*8],
#  [3*5 + 4*7, 3*6 + 4*8]]
# = [[19, 22], [43, 50]]
```

This only works when the number of **columns** in `a` equals the number of **rows** in `b`. Otherwise, raise a `ValueError`. The answer has as many rows as `a` and as many columns as `b`.

**Hint:** Watch out for this trap when building a new matrix:

```python
grid = [[0] * 3] * 2    # two references to the SAME row!
grid[0][0] = 5          # now grid is [[5, 0, 0], [5, 0, 0]]
```

Build each row separately instead, for example with a loop or a list comprehension.
