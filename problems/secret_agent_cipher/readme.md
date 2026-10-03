# Secret Agent Cipher

## The Story

Welcome to the agency, recruit. Our agents send messages using a **Caesar cipher**: every letter is shifted forward in the alphabet by a secret number.

With a shift of `3`:

```text
A → D
B → E
...
X → A
Y → B
Z → C
```

Notice that letters **wrap around** from `Z` back to `A`.

---

## Your Mission

Write two functions:

```python
encode(message, shift)
decode(message, shift)
```

`encode` shifts every letter **forward** by `shift`. `decode` shifts every letter **backward** by `shift`, undoing `encode`.

Rules:

* Uppercase letters stay uppercase, and lowercase letters stay lowercase.
* Anything that is not a letter (spaces, digits, punctuation) is left unchanged.
* `shift` can be any non-negative integer, even one larger than 26 (a shift of `29` is the same as a shift of `3`).

### Examples

```python
encode("abc", 3)              # "def"
encode("xyz", 3)              # "abc"
encode("Hello, World!", 5)    # "Mjqqt, Btwqi!"
decode("Mjqqt, Btwqi!", 5)    # "Hello, World!"
```

---

## Hints

* `ord("a")` gives the number for a character, and `chr(97)` turns a number back into a character.
* The `%` operator is perfect for wrapping around.
* Can you write `decode` by calling `encode`?
