# Sorting Hat

## The Story

A magical talking hat has been put in charge of sorting things, but it has never heard of Python's `sorted()` function or the `.sort()` method. It needs to sort the old-fashioned way!

## Your Mission

Write the functions below **without** using `sorted()` or `.sort()`. The tests check this!

Each sorting function should return a **new** sorted list (smallest to largest) and must **not** change the list it was given. Start by making a copy: `result = items[:]`.

### 1. `is_sorted(items)`

Return `True` if every item is less than or equal to the item after it, otherwise `False`. Empty lists and one-item lists are sorted.

```python
is_sorted([1, 2, 2, 5])   # True
is_sorted([3, 1, 2])      # False
```

### 2. `selection_sort(items)`

**Selection sort:** find the smallest item and swap it into position 0. Then find the smallest of the *remaining* items and swap it into position 1, and so on.

```python
selection_sort([29, 10, 14, 37, 13])   # [10, 13, 14, 29, 37]
```

### 3. `insertion_sort(items)`

**Insertion sort:** go through the items from left to right. Slide each item to the left until the item before it is not bigger, just like sorting playing cards in your hand.

```python
insertion_sort(["pear", "apple", "fig"])   # ["apple", "fig", "pear"]
```

### 4. `merge(left, right)`

Given two lists that are **already sorted**, combine them into one sorted list. Do it by walking through both lists at the same time, always taking the smaller front item.

```python
merge([1, 4, 9], [2, 3, 10, 11])   # [1, 2, 3, 4, 9, 10, 11]
```

**Bonus:** `merge` is the key step in **merge sort**. Can you use it to write a recursive `merge_sort(items)`? (It isn't tested.)
