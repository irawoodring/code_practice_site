# Shape Classes (Inheritance)

Create a small family of classes using **inheritance**. A child class gets everything from its parent class and can add to or replace what it inherits.

### `Shape` (the parent class)

* The constructor takes a `name` (a string). Store it in a `name` property with a getter (no setter needed).
* `area()` returns `0`.
* `__str__` returns a string in this format, with the area rounded to **2 decimal places**:

```text
circle with area 12.57
```

### `Circle(Shape)`

* The constructor takes a `radius`. It should call the parent constructor with the name `"circle"` using `super().__init__("circle")`.
* `radius` must be greater than `0`, otherwise raise a `ValueError`.
* `area()` returns `math.pi * radius ** 2`.

### `Rectangle(Shape)`

* The constructor takes a `width` and a `height` and uses the name `"rectangle"`.
* Both must be greater than `0`, otherwise raise a `ValueError`.
* `area()` returns `width * height`.

### `Square(Rectangle)`

* The constructor takes a single `side` and uses the name `"square"`.
* A `Square` is a `Rectangle` whose width and height are both `side`. Let `Rectangle` do the work!

**Hint:** `Square` can call `super().__init__(side, side)`, but then its name would be `"rectangle"`. Think about how `Rectangle`'s constructor could accept an optional name.

### `total_area(shapes)`

Also write a plain function (not a method) that takes a list of shapes and returns the sum of their areas.

### Example

```python
shapes = [Circle(2), Rectangle(3, 4), Square(5)]

for shape in shapes:
    print(shape)

print(total_area(shapes))
```

should print:

```text
circle with area 12.57
rectangle with area 12.00
square with area 25.00
49.56637061435917
```

Notice that the `for` loop doesn't care what kind of shape each item is. Each one knows how to compute its own `area()`. This is called **polymorphism**.
