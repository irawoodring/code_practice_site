# Binary Search Tree

A **binary search tree** (BST) stores values in nodes. Each node has up to two children, and every node follows one rule:

* everything in its **left** subtree is **smaller** than the node's value
* everything in its **right** subtree is **larger** than the node's value

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

Because of this rule, you can find a value by starting at the root and going left or right at each step. You never have to look at the whole tree!

## Your Mission

### `TreeNode`

A `TreeNode` has a `value` and two children, `left` and `right`, which start as `None`.

### `BinarySearchTree`

A `BinarySearchTree` has a `root` attribute that is either a `TreeNode` or `None` (for an empty tree).

Write these methods:

* `insert(value)` — add `value` in the correct spot. If it's already in the tree, do nothing (no duplicates).
* `in_order()` — return a list of all the values, smallest to largest
* `min()` and `max()` — return the smallest or largest value. If the tree is empty, raise a `ValueError`.
* `height()` — the number of **edges** on the longest path from the root down to a leaf. A tree with only a root has height `0`, and an empty tree has height `-1`. The tree above has height `2`.
* `remove(value)` — remove `value` from the tree. If it isn't in the tree, raise a `ValueError`.

And these special methods:

* `__contains__` — so `6 in tree` works. Don't search the whole tree! Use the BST rule to go left or right.
* `__len__` — the number of values in the tree

### Removing a Node

`remove` is the hardest part. There are three cases:

1. **No children:** just remove the node.
2. **One child:** replace the node with its child.
3. **Two children:** find the **smallest value in the right subtree**, copy it into this node, then remove that smallest value from the right subtree.

**Hint:** Most of these methods are easiest to write **recursively**, using a helper method that takes a node: `_insert(node, value)`, `_height(node)`, and so on. For `remove`, have the helper return the node that should take this node's place.
