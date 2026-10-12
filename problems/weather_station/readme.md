# Weather Station

The school's new weather station records the high temperature every day. The readings come to you as a list, one number per day:

```python
temps = [61, 64, 70, 58, 57, 66, 72]
```

Day `0` is the first day, day `1` is the second day, and so on.

## Your Mission

Write four functions.

### 1. `days_above(temps, threshold)`

Return how many days were **strictly warmer** than `threshold`.

```python
days_above([61, 64, 70, 58, 57, 66, 72], 65)   # 3
```

### 2. `high_low(temps)`

Return a tuple `(high, low)` with the warmest and coldest temperatures. If the list is empty, raise a `ValueError`.

```python
high_low([61, 64, 70, 58, 57, 66, 72])   # (72, 57)
```

### 3. `biggest_swing(temps)`

A **swing** is the change from one day to the next: `temps[day] - temps[day - 1]`. Find the swing with the largest **size** (ignoring whether it went up or down), and return a tuple `(day, change)`. Here `day` is the later of the two days, and `change` keeps its sign.

```python
biggest_swing([61, 64, 70, 58, 57, 66, 72])   # (3, -12)
```

From day 2 (70) to day 3 (58) the temperature changed by -12, which is the biggest swing.

If two swings are the same size, return the earlier one. If there are fewer than 2 days, return `None`.

### 4. `moving_average(temps, window)`

Weather forecasters smooth out the data by averaging each group of `window` days in a row. Return a list of these averages, each rounded to 1 decimal place.

```python
moving_average([61, 64, 70, 58, 57], 3)
# [65.0, 64.0, 61.7]
```

The first average is for days 0 to 2, the next is for days 1 to 3, and so on.

If `window` is less than 1 or greater than the number of days, raise a `ValueError`.

**Hint:** `abs(-12)` is `12`. List slicing like `temps[1:4]` and `sum()` are handy for the moving average.
