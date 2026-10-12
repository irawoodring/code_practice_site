# Number Guessing Bot

## The Story

"I'm thinking of a number between 1 and 100." A smart player never guesses 1, 2, 3, ... Instead, they guess the **middle** and cut the possibilities in half with each guess. This strategy is called **binary search**, and it can find any number between 1 and 1,000,000 in at most 20 guesses!

## Your Mission

### 1. `guesses(secret, low, high)`

Simulate a bot playing the guessing game for a secret number between `low` and `high` (inclusive). Each turn the bot:

1. guesses the middle: `(low + high) // 2`
2. stops if the guess is correct
3. otherwise, if the guess was too low, sets `low = guess + 1`; if it was too high, sets `high = guess - 1`

Return the **list of guesses** the bot made, ending with the correct one.

```python
guesses(37, 1, 100)   # [50, 25, 37]
guesses(50, 1, 100)   # [50]
guesses(1, 1, 10)     # [5, 2, 1]
```

If `secret` is not between `low` and `high`, raise a `ValueError`.

### 2. `binary_search(items, target)`

`items` is a list sorted from smallest to largest. Return the **index** of `target` in `items`, or `-1` if it isn't there.

```python
binary_search([2, 5, 8, 12, 16, 23, 38], 23)   # 5
binary_search([2, 5, 8, 12, 16, 23, 38], 7)    # -1
```

You must use binary search: look only at the middle item of the part of the list that's left. The tests check this by giving you a list with a million items and counting how many you look at. Using `in`, `.index()`, or a loop over every item will fail.
