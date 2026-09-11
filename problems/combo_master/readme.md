# Combo Master

You're playing an arcade game where each character in a string represents what happened during a game:

* `"H"` = hit
* `"M"` = miss

The game gives you a **combo** whenever you make consecutive hits.

For example:

```text
"HHMHHHHM"
```

contains a longest streak of **4 consecutive hits**.

Your job is to write a function called `longest_combo` that determines the largest combo achieved during the game.

### Examples

```text
longest_combo("HHMHHHHM") → 4
longest_combo("HHHH") → 4
longest_combo("MHMHM") → 1
longest_combo("MMMM") → 0
```

### Requirements

Write the following function:

```python
def longest_combo(game):
    ...
```

The function should:

1. Find the longest consecutive sequence of `"H"` characters.
2. Return the length of that sequence.
3. Return `0` if there are no hits.
4. You may assume `game` contains only `"H"` and `"M"` characters.

### Example

Given:

```text
"HHMHHHHMHH"
```

There are three groups of hits:

```text
HH
HHHH
HH
```

The longest group contains 4 hits, so:

```text
longest_combo("HHMHHHHMHH") → 4
```

### Hint

You'll need to keep track of **two values**:

* The combo you're currently building
* The largest combo you've seen so far

When you see an `"H"`, increase the current combo.

When you see an `"M"`, reset the current combo back to `0`.

Then compare the current combo to the best combo you've seen.

Try solving this with a single `for` loop.

