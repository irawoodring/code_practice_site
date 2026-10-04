# Rectangle Class

Create a Python class called `Rectangle` that represents a rectangle.

A `Rectangle` should have two properties:

* `width` — must be a number greater than 0
* `height` — must be a number greater than 0

Both properties should have getters and setters. Invalid values should raise a `ValueError`.

### Methods

Add the following methods:

* `area()` — returns `width * height`
* `perimeter()` — returns `2 * (width + height)`
* `is_square()` — returns `True` if the width and height are equal, otherwise `False`
* `scale(factor)` — multiplies both the width and height by `factor`. The factor must be greater than 0, otherwise raise a `ValueError`.

### String Representation

The class should have a `__str__` method with this format:

```text
Rectangle(3 x 4)
```

### Example

```python
r = Rectangle(3, 4)
print(r.area())        # 12
print(r.perimeter())   # 14
print(r.is_square())   # False

r.scale(2)
print(r)               # Rectangle(6 x 8)
```

### Comparing Rectangles

Finally, add an `__eq__` method so that two rectangles are equal (`==`) when they have the same width **and** the same height:

```python
Rectangle(3, 4) == Rectangle(3, 4)   # True
Rectangle(3, 4) == Rectangle(4, 3)   # False
```
