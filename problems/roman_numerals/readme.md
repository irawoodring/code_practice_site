# Roman Numerals

## The Story

The museum's new exhibit on ancient Rome needs signs with Roman numerals, and the curator keeps getting them wrong. Help them out!

Roman numerals use these symbols:

```text
I = 1    V = 5    X = 10    L = 50    C = 100    D = 500    M = 1000
```

Symbols are usually written largest to smallest and added up: `XVI = 10 + 5 + 1 = 16`.

But six special pairs put a **smaller symbol before a larger one** to subtract:

```text
IV = 4    IX = 9    XL = 40    XC = 90    CD = 400    CM = 900
```

---

## Your Mission

### 1. `to_roman(number)`

Convert a whole number from `1` to `3999` into a Roman numeral.

```python
to_roman(16)     # "XVI"
to_roman(1994)   # "MCMXCIV"
to_roman(4)      # "IV"
```

If `number` is outside `1` to `3999`, raise a `ValueError`.

### 2. `from_roman(numeral)`

Convert a Roman numeral back into a number. You may assume the numeral is valid.

```python
from_roman("XVI")       # 16
from_roman("MCMXCIV")   # 1994
```

**Hints:**

* For `to_roman`, make a list of `(value, symbol)` pairs from largest to smallest, **including** the six special pairs: `[(1000, "M"), (900, "CM"), (500, "D"), ...]`. While the number is at least as big as a value, add the symbol and subtract the value.
* For `from_roman`, look at each symbol and the one after it. If the next symbol is worth **more**, subtract this one; otherwise add it.
