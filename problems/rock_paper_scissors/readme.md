# Rock Paper Scissors Tournament

## The Rules

* `"rock"` beats `"scissors"`
* `"scissors"` beats `"paper"`
* `"paper"` beats `"rock"`
* The same move on both sides is a tie.

---

## Your Mission

### 1. `play_round(move1, move2)`

Return:

* `1` if player 1 wins
* `2` if player 2 wins
* `0` if it's a tie

Moves may have any capitalization (`"Rock"`, `"ROCK"`, and `"rock"` are all the same). If either move is not rock, paper, or scissors, raise a `ValueError`.

```python
play_round("rock", "scissors")    # 1
play_round("Paper", "scissors")   # 2
play_round("rock", "ROCK")        # 0
```

### 2. `play_match(moves1, moves2)`

`moves1` and `moves2` are lists of moves for each player, one per round. Play every round and return a tuple:

```python
(player1_wins, player2_wins, ties)
```

If the two lists are not the same length, raise a `ValueError`.

```python
play_match(["rock", "paper", "rock"], ["scissors", "scissors", "rock"])
# (1, 1, 1)
```

### 3. `match_winner(moves1, moves2)`

Return `"Player 1"`, `"Player 2"`, or `"Tie"` depending on who won more rounds.

```python
match_winner(["rock", "rock"], ["scissors", "paper"])   # "Tie"
match_winner(["paper", "paper"], ["rock", "paper"])     # "Player 1"
```

**Hint:** A dictionary like `{"rock": "scissors", ...}` that maps each move to the move it beats makes `play_round` short and sweet.
