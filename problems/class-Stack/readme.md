# Stack Class

A **stack** is a collection where the last item added is the first item removed ("last in, first out"). Think of a stack of pancakes: you add to the top, and you eat from the top.

Create a Python class called `Stack`.

### Methods

* `push(item)` — put `item` on the top of the stack
* `pop()` — remove the top item and return it
* `peek()` — return the top item **without** removing it
* `is_empty()` — return `True` if the stack has no items, otherwise `False`

If `pop()` or `peek()` is called on an empty stack, raise an `IndexError`.

### Special Methods

* `__len__` — so that `len(stack)` returns the number of items
* `__str__` — show the items from bottom to top, with the top on the right, in this format:

```text
[bottom] 1, 2, 3 [top]
```

An empty stack should look like this:

```text
[bottom] [top]
```

### Example

```python
s = Stack()
s.push("pancake")
s.push("waffle")
print(len(s))      # 2
print(s.peek())    # waffle
print(s.pop())     # waffle
print(s.pop())     # pancake
print(s.is_empty())  # True
```

**Hint:** Store the items in a list inside the object. Which end of the list should be the top so that `push` and `pop` are fast?
