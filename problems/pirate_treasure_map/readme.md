# 🏴‍☠️ Pirate Treasure Map

A pirate has found a treasure map containing a sequence of numbers. The pirate believes the treasure is hidden at the location represented by the **largest number** in the sequence.

Your job is to help the pirate find the treasure!

Write a function called `treasure_location` that takes a list of numbers and returns the **index** of the largest number.

Remember that list indexes start at `0`.

### Examples

```text
treasure_location([3, 7, 2, 9, 4]) → 3
treasure_location([10, 5, 8]) → 0
treasure_location([1, 2, 3, 4]) → 3
```

For example:

```text
[3, 7, 2, 9, 4]
          ↑
```

The largest number is `9`, and it is at index `3`.

### Requirements

Write the following function:

```python
def treasure_location(numbers):
    ...
```

The function should:

1. Find the largest number in the list.
2. Return the **index** where that number occurs.
3. If the largest number appears more than once, return the index of its **first occurrence**.
4. You may assume the list contains at least one number.
5. Do **not** use Python's built-in `max()` or `.index()` methods.

### Examples with repeated values

```text
treasure_location([4, 9, 2, 9, 5]) → 1
```

Even though `9` appears at indexes `1` and `3`, we return `1` because it is the first occurrence.

### Hint

You will probably want to keep track of two things as you loop through the list:

* The largest number you've seen so far
* The index of that number

You can use:

```python
for i in range(len(numbers)):
```

to loop through the indexes of the list.

