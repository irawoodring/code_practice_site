# Password Checker

Your school's IT department wants a tool that tells students **why** their password is weak, instead of just saying "invalid password."

## Your Mission

### 1. `password_problems(password)`

Check the password against the rules below and return a **list** of the problems you find. Each problem is a short string, and the problems must appear in this order:

* `"too short"` — the password has fewer than 8 characters
* `"no uppercase"` — the password has no uppercase letter
* `"no lowercase"` — the password has no lowercase letter
* `"no digit"` — the password has no digit
* `"no special"` — the password has none of these special characters:

```text
!@#$%^&*?
```

* `"has spaces"` — the password contains a space

If the password has no problems, return an empty list.

```python
password_problems("hello")
# ["too short", "no uppercase", "no digit", "no special"]

password_problems("Sunny Day 42!")
# ["has spaces"]

password_problems("Tr0ub4dor&3")
# []
```

### 2. `is_strong(password)`

Return `True` if the password has no problems, otherwise `False`.

```python
is_strong("Tr0ub4dor&3")   # True
is_strong("password")      # False
```

**Hint:** String methods like `.isupper()`, `.islower()`, and `.isdigit()` work on single characters. The `in` operator can tell you whether a character is in a string of special characters.
