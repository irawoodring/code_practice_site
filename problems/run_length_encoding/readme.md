# Run-Length Encoding

## The Story

Old video games had very little memory, so their artists packed pictures down with a trick called **run-length encoding**. Instead of storing every pixel, you store how many times each character repeats in a row:

```text
"WWWWBBBWW"  →  "4W3B2W"
```

---

## Your Mission

### 1. `encode(text)`

Return the encoded string: for each run of the same character, write the **count** followed by the **character**. Runs of length 1 still get a count of `1`.

```python
encode("WWWWBBBWW")   # "4W3B2W"
encode("abc")         # "1a1b1c"
encode("")            # ""
```

You may assume `text` contains no digits.

### 2. `decode(code)`

Turn an encoded string back into the original text. Counts can have **more than one digit**!

```python
decode("4W3B2W")   # "WWWWBBBWW"
decode("12x1y")    # "xxxxxxxxxxxxy"
decode("")         # ""
```

### 3. `compression_ratio(text)`

Return `len(encode(text)) / len(text)`, rounded to **2 decimal places**. A number below `1` means encoding made the text shorter. If `text` is empty, return `0`.

```python
compression_ratio("WWWWBBBWW")   # 0.67
```

**Hint:** For `encode`, keep track of the current character and how many times you've seen it in a row. Don't forget the last run after the loop ends! For `decode`, build up the digits in a string until you reach a letter. `"a" * 3` is `"aaa"`.
