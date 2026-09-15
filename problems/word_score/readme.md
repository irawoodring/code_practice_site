# Word Score

Write a Python program that calculates the **score of a word**.

Each letter is worth points according to these rules:

* `A, E, I, O, U` → **1 point**
* `S, T, R, N` → **2 points**
* Every other letter → **3 points**

Your program should contain a function:

```python
def word_score(word):
    """Return the score of word."""
```

The function should:

1. Accept a string containing a word.
2. Ignore capitalization (`"Python"` and `"python"` should have the same score).
3. Add up the points for every letter.
4. Return the total score as an integer.

### Examples

```text
word_score("cat")    → 7
word_score("python") → 15
word_score("AEIOU")  → 5
word_score("test")   → 8
```

You may assume the input contains only letters (no spaces, numbers, or punctuation).

**Challenge:** After completing the function, write a small program that asks the user for a word and prints its score.

