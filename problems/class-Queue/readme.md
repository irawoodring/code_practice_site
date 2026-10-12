# Queue Class

A **queue** is like a line at the cafeteria: the first person to get in line is the first person served ("first in, first out").

## Part 1: The `Queue` Class

Create a class called `Queue` with these methods:

* `enqueue(item)` — add `item` to the **back** of the queue
* `dequeue()` — remove the item at the **front** of the queue and return it
* `peek()` — return the front item **without** removing it
* `is_empty()` — return `True` if the queue has no items, otherwise `False`

If `dequeue()` or `peek()` is called on an empty queue, raise an `IndexError`.

Also add these special methods:

* `__len__` — so `len(queue)` returns the number of items
* `__str__` — show the items from front to back in this format:

```text
[front] Ada, Grace, Linus [back]
```

An empty queue looks like `[front] [back]`.

## Part 2: Hot Potato

In the game **Hot Potato**, players stand in a circle and pass a potato. After a certain number of passes, whoever is holding the potato is out. Play continues until one player is left.

Write a function (not a method):

```python
hot_potato(names, passes)
```

Use your `Queue` to play the game. The person at the front of the queue is holding the potato. Each round:

1. Pass the potato `passes` times. Each pass moves the person at the front of the queue to the back.
2. The person now at the front is out: dequeue them.

Return a list of the names **in the order they were knocked out**, so the winner is the last name in the list.

```python
hot_potato(["Ada", "Bo", "Cy", "Di"], 2)
# ["Cy", "Bo", "Di", "Ada"]
```

Let's trace the first round. The queue starts as `Ada, Bo, Cy, Di`. After 2 passes it is `Cy, Di, Ada, Bo`, so Cy is out.

If `names` is empty, raise a `ValueError`. Don't change the `names` list you were given.

**Challenge:** `list.pop(0)` is slow for big lists, because every other item has to shift over. Can you make `dequeue` fast? Look up `collections.deque`, or try using two lists.
