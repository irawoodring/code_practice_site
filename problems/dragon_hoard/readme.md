# Dragon Hoard

## The Story

Smaug the dragon is obsessed with counting treasure. His hoard is stored as a dictionary that maps each kind of treasure to how many he has:

```python
hoard = {"gold coin": 500, "ruby": 12, "crown": 1}
```

---

## Your Mission

Write three functions.

### 1. `add_loot(hoard, loot)`

`loot` is a **list** of treasure names picked up on a raid:

```python
["ruby", "gold coin", "ruby", "silver cup"]
```

Add each item to the hoard (one item per entry in the list) and **return a new dictionary**. Do **not** change the original `hoard`.

```python
add_loot({"gold coin": 500, "ruby": 12}, ["ruby", "gold coin", "ruby", "silver cup"])
# {"gold coin": 501, "ruby": 14, "silver cup": 1}
```

### 2. `hoard_value(hoard, prices)`

`prices` is a dictionary mapping treasure names to how much each one is worth. Return the total value of the hoard.

Any treasure that isn't in `prices` is worth `0`.

```python
hoard_value({"gold coin": 10, "ruby": 2, "old boot": 3}, {"gold coin": 1, "ruby": 50})
# 110
```

### 3. `most_common(hoard)`

Return the name of the treasure the dragon has the **most** of. If there is a tie, return the name that comes first **alphabetically**. If the hoard is empty, return `None`.

```python
most_common({"gold coin": 500, "ruby": 12})   # "gold coin"
most_common({"ruby": 3, "emerald": 3})        # "emerald"
```
