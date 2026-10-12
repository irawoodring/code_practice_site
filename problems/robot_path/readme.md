# Robot Path

## The Story

A delivery robot lives on a giant grid. It starts at position `(0, 0)` and receives its instructions as a string of single-letter commands:

* `N` — move north (up): `y + 1`
* `S` — move south (down): `y - 1`
* `E` — move east (right): `x + 1`
* `W` — move west (left): `x - 1`

---

## Your Mission

### 1. `final_position(commands)`

Return the robot's final position as a tuple `(x, y)`.

```python
final_position("NNEE")    # (2, 2)
final_position("NESW")    # (0, 0)
final_position("")        # (0, 0)
```

Commands might be lowercase too — `"nnee"` should work the same as `"NNEE"`.

If the string contains any other character, raise a `ValueError`.

### 2. `distance_home(commands)`

Robots can only drive along grid lines, so the distance home is the **Manhattan distance**: `|x| + |y|`.

```python
distance_home("NNEE")    # 4
distance_home("NNWWWS")  # 4
```

### 3. `visits_twice(commands)`

Return `True` if the robot ever lands on a position it has already been on (including the start), otherwise `False`.

```python
visits_twice("NES")    # False
visits_twice("NESW")   # True   (back at the start)
```

**Hint:** A `set` of tuples is a great way to remember where you've been.
