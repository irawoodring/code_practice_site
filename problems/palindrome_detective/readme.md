# Palindrome Detective

A **palindrome** reads the same forward and backward, like `"racecar"` or `"level"`.

Real-world palindromes are trickier. `"A man, a plan, a canal: Panama!"` is a palindrome too, once you ignore capitalization, spaces, and punctuation.

---

## Your Mission

### 1. `is_palindrome(text)`

Return `True` if `text` is a palindrome, ignoring capitalization and any character that is not a letter or digit. Otherwise return `False`.

```python
is_palindrome("racecar")                          # True
is_palindrome("A man, a plan, a canal: Panama!")  # True
is_palindrome("hello")                            # False
is_palindrome("")                                 # True
```

### 2. `find_palindromes(words)`

Given a list of strings, return a new list containing only the palindromes, in their original order.

```python
find_palindromes(["kayak", "python", "Noon", "abc"])
# ["kayak", "Noon"]
```

### 3. `longest_palindrome(text)`

Return the longest **substring** of `text` that is a palindrome (this time, compare characters exactly: no ignoring case or punctuation). If there is a tie, return the one that appears first. If `text` is empty, return `""`.

```python
longest_palindrome("babad")      # "bab"
longest_palindrome("cbbd")       # "bb"
longest_palindrome("abc")        # "a"
```

**Hint:** `.isalnum()` and string slicing (`text[::-1]`) are your friends.
