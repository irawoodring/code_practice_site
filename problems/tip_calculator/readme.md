# Tip Calculator

You're out to dinner with friends and nobody wants to do the math. Let's write a program that does it for you!

## Your Mission

Write three functions. Each one takes a `percent` argument that should **default to 18** if it isn't given.

### 1. `tip_amount(bill, percent=18)`

Return the tip: `percent` percent of the bill, rounded to 2 decimal places.

```python
tip_amount(50)        # 9.0
tip_amount(50, 20)    # 10.0
tip_amount(42.40, 15) # 6.36
```

### 2. `total(bill, percent=18)`

Return the bill plus the tip, rounded to 2 decimal places.

```python
total(50)       # 59.0
total(40, 25)   # 50.0
```

### 3. `split(bill, people, percent=18)`

Return how much each person pays when the total (bill plus tip) is shared evenly, rounded to 2 decimal places.

```python
split(100, 4)       # 29.5
split(60, 3, 20)    # 24.0
```

### Bad Input

Raise a `ValueError` if:

* `bill` is negative
* `percent` is negative
* `people` is less than 1

**Hint:** `round(3.14159, 2)` gives `3.14`. Can `total` and `split` call the functions you already wrote?
