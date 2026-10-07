# Recursion Practice

A **recursive** function is a function that calls itself. Every recursive function needs:

* a **base case**: a simple input where the answer is known right away
* a **recursive case**: a step that solves a smaller version of the problem by calling the function again

For example:

```python
def countdown(n):
    if n == 0:                       # base case
        return [0]
    return [n] + countdown(n - 1)    # recursive case
```

## Your Mission

Write the five functions below **using recursion**. You may **not** use `for` loops, `while` loops, or comprehensions inside them. The tests check this!

### 1. `factorial(n)`

Return `n!`, the product of every whole number from `1` up to `n`. By definition, `factorial(0)` is `1`.

```python
factorial(5)   # 120, because 5 * 4 * 3 * 2 * 1 = 120
```

### 2. `sum_digits(n)`

Return the sum of the digits of a non-negative integer.

```python
sum_digits(4096)   # 19
```

**Hint:** `n % 10` is the last digit and `n // 10` is everything except the last digit.

### 3. `reverse(text)`

Return the string reversed. (No `[::-1]` either. Do it recursively!)

```python
reverse("stressed")   # "desserts"
```

### 4. `count(items, target)`

Return how many times `target` appears in the list `items`.

```python
count([1, 2, 1, 3, 1], 1)   # 3
```

### 5. `flatten(nested)`

`nested` is a list that may contain other lists, which may contain other lists, and so on. Return one flat list of all the non-list values, in order.

```python
flatten([1, [2, 3], [[4], 5]])   # [1, 2, 3, 4, 5]
```

**Hint:** `isinstance(x, list)` tells you whether `x` is a list.
