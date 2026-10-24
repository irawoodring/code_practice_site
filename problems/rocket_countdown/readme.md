# Rocket Countdown

## The Story

Mission control needs software for the next rocket launch. Some of these jobs don't have a fixed number of steps, which makes them perfect for a `while` loop.

---

## Your Mission

### 1. `countdown(start)`

Return a list counting down from `start` to `1`, followed by `"Liftoff!"`.

```python
countdown(5)   # [5, 4, 3, 2, 1, "Liftoff!"]
countdown(0)   # ["Liftoff!"]
```

If `start` is negative, raise a `ValueError`.

### 2. `fuel_burns(fuel, burn_rate)`

The rocket burns `burn_rate` units of fuel every second. Return how many **full seconds** the rocket can burn before it doesn't have enough fuel for another full burn.

```python
fuel_burns(100, 30)   # 3   (100 → 70 → 40 → 10, then 10 isn't enough)
fuel_burns(90, 30)    # 3
fuel_burns(10, 30)    # 0
```

If `burn_rate` is not greater than `0`, raise a `ValueError`. Solve this with a loop, not division!

### 3. `orbit_steps(n)`

The navigation computer runs this process on a positive whole number `n`:

* If `n` is even, divide it by 2.
* If `n` is odd, multiply it by 3 and add 1.

It keeps going until `n` reaches `1`. Return **how many steps** that takes.

```python
orbit_steps(1)   # 0
orbit_steps(6)   # 8   (6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1)
```

If `n` is less than `1`, raise a `ValueError`.

**Hint:** A `while` loop keeps running as long as its condition is `True`. Make sure something inside the loop changes so the loop eventually stops!
