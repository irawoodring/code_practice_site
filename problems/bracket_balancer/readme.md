# Bracket Balancer

Code editors highlight your mistakes when you forget to close a bracket. Let's build that feature!

There are three kinds of brackets, and each opening bracket has a matching closing bracket:

* `(` matches `)`
* `[` matches `]`
* `{` matches `}`

A string is **balanced** when every opening bracket is closed by the matching kind of bracket, in the right order. All other characters are ignored.

```text
"(a + b) * [c - d]"     balanced
"{[()()]}"              balanced
"(]"                    NOT balanced (wrong kind)
"([)]"                  NOT balanced (wrong order)
"(()"                   NOT balanced (never closed)
"())"                   NOT balanced (nothing to close)
```

## Your Mission

### 1. `is_balanced(text)`

Return `True` if `text` is balanced, otherwise `False`. An empty string is balanced.

### 2. `first_error(text)`

Return the **index** of the character that causes the problem, or `-1` if the string is balanced:

* If a closing bracket doesn't match the most recent open bracket, or there is no open bracket left for it to close, return the index of that **closing** bracket.
* If the end of the string is reached and some brackets were never closed, return the index of the **earliest** opening bracket that was never closed.

```python
first_error("(a + b))")    # 7
first_error("([)]")        # 2
first_error("x = (1 + [2") # 4
first_error("{[()]}")      # -1
```

**Hint:** This is a classic job for a **stack**. A Python list works as a stack: `.append()` pushes onto the top and `.pop()` removes from the top. What should go on the stack so that you can also report an index?
