# Linked List Class

## The Story

A freight train is a chain of cars. Each car knows only one thing about the rest of the train: which car is hooked on **behind** it. The engine keeps track of the **first** car.

That's exactly how a **singly linked list** works!

## Your Mission

Create two classes. **Do not** store the values in a Python list. The point is to link `Node` objects together.

### `Node`

A `Node` stores one value and a link to the next node:

```python
node = Node("coal")
node.value   # "coal"
node.next    # None
```

### `LinkedList`

A `LinkedList` has a `head` attribute that refers to the first `Node`, or `None` if the list is empty.

Write these methods:

* `append(value)` — add a new node holding `value` at the **end**
* `prepend(value)` — add a new node holding `value` at the **front**
* `to_list()` — return a regular Python list of the values, front to back
* `remove(value)` — remove the **first** node holding `value`. If no node holds `value`, raise a `ValueError`.

And these special methods:

* `__len__` — the number of nodes, so `len(train)` works
* `__contains__` — so that `value in train` works
* `__str__` — the values joined by `" -> "`, for example `coal -> lumber -> cattle`. An empty list should be an empty string.

### Example

```python
train = LinkedList()
train.append("coal")
train.append("lumber")
train.prepend("engine")
print(train)              # engine -> coal -> lumber
print(len(train))         # 3
print("coal" in train)    # True

train.remove("coal")
print(train.to_list())    # ['engine', 'lumber']
print(train.head.value)   # engine
```

**Hint:** Most methods start with `current = self.head` and then move along with `current = current.next` until `current` is `None`. Draw boxes and arrows on paper before you write `remove`!
