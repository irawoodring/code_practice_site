# FizzBuzz Plus

FizzBuzz is a famous counting game. Count up from 1, but:

* if the number is divisible by 3, say `"Fizz"`
* if the number is divisible by 5, say `"Buzz"`
* if the number is divisible by both, say `"FizzBuzz"`
* otherwise, just say the number

## Your Mission

### 1. `fizzbuzz(n)`

Return a **list of strings** for the numbers 1 through `n`:

```python
fizzbuzz(15)
# ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz",
#  "11", "Fizz", "13", "14", "FizzBuzz"]
```

Notice that the numbers are strings too: `"1"`, not `1`.

If `n` is 0 or less, return an empty list.

### 2. `custom_fizzbuzz(n, rules)`

Now let the players invent their own rules! `rules` is a list of `(divisor, word)` tuples. For each number from 1 to `n`:

* go through the rules **in order**, and add the word for every divisor that divides the number
* if no rules match, use the number itself

```python
custom_fizzbuzz(7, [(2, "Zip"), (3, "Zap")])
# ["1", "Zip", "Zap", "Zip", "5", "ZipZap", "7"]
```

With the rules `[(3, "Fizz"), (5, "Buzz")]`, `custom_fizzbuzz` should give exactly the same answer as `fizzbuzz`.

**Hint:** Build up a string for each number. If the string is still empty after checking every rule, use `str(number)` instead. Can you write `fizzbuzz` with one line that calls `custom_fizzbuzz`?
