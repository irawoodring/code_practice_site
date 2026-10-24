# Leaderboard

## The Story

Your school is running a coding contest, and the scores are stored in a dictionary mapping each player to their score:

```python
scores = {"Ada": 92, "Grace": 98, "Linus": 85, "Alan": 98}
```

The contest website needs a leaderboard.

---

## Your Mission

### 1. `ranked(scores)`

Return a **list of tuples** `(name, score)` sorted from **highest score to lowest**. If two players have the same score, put them in **alphabetical order** by name.

```python
ranked(scores)
# [("Alan", 98), ("Grace", 98), ("Ada", 92), ("Linus", 85)]
```

### 2. `top_players(scores, n)`

Return a list of just the **names** of the top `n` players, in leaderboard order. If `n` is bigger than the number of players, return all of them.

```python
top_players(scores, 2)   # ["Alan", "Grace"]
```

### 3. `rank_of(scores, name)`

Return the player's position on the leaderboard, starting at `1` for first place. Use the order from `ranked`. If the player isn't in `scores`, raise a `KeyError`.

```python
rank_of(scores, "Ada")    # 3
rank_of(scores, "Alan")   # 1
```

**Hint:** `sorted()` takes a `key` argument. A key function can return a tuple, and Python sorts by the first item, then the second. Sorting by `-score` puts high scores first:

```python
sorted(items, key=lambda pair: (-pair[1], pair[0]))
```
