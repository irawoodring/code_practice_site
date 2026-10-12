# Fraction Class

Computers store numbers like `0.1` approximately, which is why `0.1 + 0.2` is `0.30000000000000004` in Python. A `Fraction` class can do **exact** math with numbers like 1/3.

This problem practices **operator overloading**: teaching Python what `+`, `-`, `==`, and friends mean for your own class.

## Your Mission

Create a class called `Fraction`. Don't use Python's built-in `fractions` module. The tests check this!

### Creating a Fraction

```python
Fraction(3, 4)   # three quarters
Fraction(5)      # 5/1 (the denominator defaults to 1)
```

* The numerator and denominator must both be integers, otherwise raise a `TypeError`.
* A denominator of `0` should raise a `ZeroDivisionError`.
* Fractions are always stored in **lowest terms**: `Fraction(6, 8)` becomes `3/4`.
* The denominator is always **positive**: `Fraction(1, -2)` becomes `-1/2`.

Provide read-only properties `numerator` and `denominator`.

**Hint:** `math.gcd(6, 8)` returns `2`, the greatest common divisor.

### String Representation

`__str__` should return `"3/4"`, or just the whole number if the denominator is 1:

```python
str(Fraction(3, 4))    # "3/4"
str(Fraction(-1, 2))   # "-1/2"
str(Fraction(10, 5))   # "2"
```

### Math Operators

Write `__add__`, `__sub__`, `__mul__`, and `__truediv__` so that `+`, `-`, `*`, and `/` work between two fractions and return a new `Fraction`:

```python
Fraction(1, 2) + Fraction(1, 3)   # 5/6
Fraction(1, 2) - Fraction(3, 4)   # -1/4
Fraction(2, 3) * Fraction(3, 4)   # 1/2
Fraction(1, 2) / Fraction(1, 4)   # 2
```

The right-hand side may also be an `int`: `Fraction(1, 2) + 1` is `3/2`. Dividing by zero should raise a `ZeroDivisionError`.

### Comparison Operators

Write `__eq__` and `__lt__` so that `==` and `<` work. As with the math operators, the right-hand side may be a `Fraction` or an `int`.

```python
Fraction(1, 2) == Fraction(2, 4)   # True
Fraction(4, 2) == 2                # True
Fraction(1, 3) < Fraction(1, 2)    # True
```

### Converting to a Float

Write `__float__` so that `float(Fraction(1, 4))` returns `0.25`.

**Hint:** Write a small helper that turns an `int` into a `Fraction`, so each operator only has to handle fractions.
