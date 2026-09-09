# 🧙 The Wizard's Spellbook

A young wizard is learning magic, but there's a problem: their spellbook contains spells with **too many vowels**!

The wizard believes that a spell is more powerful when it contains fewer vowels. Your job is to help determine the power of a spell.

Write a function called `spell_power` that counts the number of **consonants** in a spell.

The letters `a`, `e`, `i`, `o`, and `u` are vowels. Every other letter is considered a consonant.

Spaces and punctuation should be ignored.

### Examples

```text
spell_power("abracadabra") → 6
spell_power("fireball") → 5
spell_power("magic missile") → 7
spell_power("!!!") → 0
spell_power("") → 0
```

### Requirements

Write the following function:

```python
def spell_power(spell):
    ...
```

The function should:

1. Examine every character in the spell.
2. Count characters that are letters but are **not** vowels.
3. Ignore spaces and punctuation.
4. Return the number of consonants.
5. You may assume the input contains lowercase letters, spaces, and punctuation.

### Example

For:

```text
"fireball!"
```

The letters are:

```text
f i r e b a l l
```

The consonants are:

```text
f r b l l
```

So:

```text
spell_power("fireball!") → 5
```

### Hint

You can check whether a character is a letter using:

```python
char.isalpha()
```

And you can check whether it is a vowel using:

```python
char in "aeiou"
```

Try solving this using a `for` loop and an `if` statement.

