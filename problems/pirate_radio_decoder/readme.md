# Pirate Radio Decoder

##  The Story

Ahoy, pirate! You intercepted a mysterious radio message from a rival pirate crew.

Somewhere inside the message is a **secret treasure code**.

The treasure code is always surrounded by numbers:

```text
123456789TREASURECODE987654
         ^^^^^^^^^^^
```

The tricky part is that you **don't know where the code starts or ends**!

Your job is to write a function that finds the treasure code.

---

## Your Mission

Write a function called:

```python
extract_treasure_code(message)
```

The function should return the part of the message that contains the treasure code.

The treasure code:

* is surrounded by digits (`0` through `9`)
* contains **no digits**
* can be a different length each time
* can appear at different positions in the message

For example:

```python
extract_treasure_code("12345TREASURE9876")
```

should return:

```text
TREASURE
```

Another example:

```python
extract_treasure_code("9999GOLDCOIN42")
```

should return:

```text
GOLDCOIN
```

And:

```python
extract_treasure_code("123THELOSTMAP456789")
```

should return:

```text
THELOSTMAP
```

---

## How Can You Find It?

You **cannot assume** that the treasure code starts or ends at a particular index.

Instead, use a **loop** to search through the string.

You need to find:

1. The **first character that is not a digit**
2. The **last character that is not a digit**

Then use string slicing to extract everything between those two positions.

Python gives you a useful tool for checking whether a character is a digit:

```python
character.isdigit()
```

For example:

```python
"7".isdigit()
```

returns:

```python
True
```

while:

```python
"T".isdigit()
```

returns:

```python
False
```

---

## Hints

### Hint 1

Start at the beginning of the string and use a loop to look for the first character that **isn't** a digit.

You might want to keep track of its index.

### Hint 2

You can also search from the end of the string to find the last character that isn't a digit.

### Hint 3

Remember that the second number in a slice is **not included**.

For example:

```python
message[5:12]
```

includes index `5` through index `11`.

---

## Requirements

Your function should:

* accept one string called `message`
* use at least one loop
* use `.isdigit()` to determine whether characters are digits
* find the beginning and end of the treasure code
* use string slicing to return the treasure code

Do **not** assume the treasure code is always at the same index.

Do not use:

* `.find()`
* `.index()`
* regular expressions
* hard-coded positions

---

## Examples

```python
extract_treasure_code("12345TREASURE9876")
```

returns:

```text
TREASURE
```

```python
extract_treasure_code("999GOLDCOIN123")
```

returns:

```text
GOLDCOIN
```

```python
extract_treasure_code("123THELOSTMAP456")
```

returns:

```text
THELOSTMAP
```

```python
extract_treasure_code("7XMARKS42")
```

returns:

```text
XMARKS
```

---

## Pirate's Challenge

The message might contain a **very short** treasure code:

```text
123A987
```

or a much longer one:

```text
987654THEANCIENTPIRATECHESTCODE12345
```

Your code should work for both!

The pirates are counting on you. 

