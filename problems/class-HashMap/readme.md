# HashMap Class

Python's `dict` can look up any key almost instantly, no matter how many keys it holds. How? It uses a **hash table**. In this problem you'll build your own!

**Rule:** don't use Python's `dict` or `set` anywhere in your code (no `{}`, `dict()`, or `set()`). The tests check this. You may use lists and tuples.

## How a Hash Table Works

The table is a list of **buckets**. Each bucket is a list that holds `(key, value)` pairs.

To find the bucket for a key, compute:

```python
index = hash(key) % capacity
```

Python's built-in `hash()` turns a key into an integer, and `% capacity` turns that into a valid bucket index. Two different keys can land in the same bucket. That's called a **collision**, and it's why each bucket is a list.

## Your Mission

Create a class called `HashMap`.

* The constructor takes an optional starting `capacity` (the number of buckets), which defaults to `8`.
* `capacity` — a read-only property that returns the current number of buckets
* `put(key, value)` — store `value` under `key`. If `key` is already in the map, replace its value.
* `get(key)` — return the value stored under `key`. If the key isn't there, raise a `KeyError`.
* `remove(key)` — delete `key` and its value. If the key isn't there, raise a `KeyError`.
* `keys()` — return a list of all the keys (in any order)
* `__len__` — the number of keys stored
* `__contains__` — so `key in my_map` works

### Growing the Table

If too many keys pile into too few buckets, lookups get slow. So, after `put` adds a **new** key, check the **load factor**:

```python
load_factor = number_of_keys / capacity
```

If the load factor is **greater than 0.75**, double the capacity. Then **rehash** every pair into the new, larger list of buckets. Each key's bucket index changes when the capacity changes!

```python
m = HashMap()
for i in range(6):
    m.put(i, i)
m.capacity    # 8, because 6 / 8 = 0.75 is not greater than 0.75
m.put(6, 6)
m.capacity    # 16, because 7 / 8 = 0.875 is too full
```
