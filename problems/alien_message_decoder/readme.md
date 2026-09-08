# Alien Message Decoder

You are working at a space station when you receive a strange message from an alien civilization.

The aliens communicate using a simple code:

* Every letter in the message has been shifted **one position forward** in the alphabet.
* For example:

  * `a` becomes `b`
  * `b` becomes `c`
  * `x` becomes `y`
  * `y` becomes `z`
  * `z` becomes `a`

Spaces and punctuation are left unchanged.

Your job is to write a function called `decode_message` that converts the alien message back into normal English.

### Examples

```text
decode_message("ifmmp") → "hello"
decode_message("uijt jt b tfdsfu") → "this is a secret"
decode_message("ibwf! b! ojdf! ebz!") → "have! a! nice! day!"
```

### Requirements

Write the following function:

```python
def decode_message(message):
    ...
```

The function should:

1. Shift every lowercase letter **back by one** in the alphabet.
2. Change `a` into `z`.
3. Leave spaces, numbers, and punctuation unchanged.
4. Return the decoded message.
5. You may assume the input contains only lowercase letters, spaces, numbers, and punctuation.

### Hint

You can use `ord()` and `chr()` to work with the numeric values of characters, or you can create a string containing the alphabet and find each character's position.

For example:

```python
alphabet = "abcdefghijklmnopqrstuvwxyz"
```

- You're probably going to need a loop!

