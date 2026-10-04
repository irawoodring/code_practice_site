# Grade Book

You're helping a teacher automate their grade book. Write three functions.

---

### 1. `letter_grade(score)`

Return the letter grade for a numeric score:

| Score         | Grade |
|---------------|-------|
| 90 and above  | `"A"` |
| 80 – 89.99    | `"B"` |
| 70 – 79.99    | `"C"` |
| 60 – 69.99    | `"D"` |
| below 60      | `"F"` |

If the score is less than 0 or greater than 100, raise a `ValueError`.

```python
letter_grade(95)     # "A"
letter_grade(80)     # "B"
letter_grade(59.9)   # "F"
```

---

### 2. `average(scores)`

Given a list of scores, return their average. If the list is empty, return `0`.

```python
average([90, 80, 70])   # 80.0
```

---

### 3. `report(grades)`

`grades` is a dictionary mapping each student's name to a **list** of their scores:

```python
{
    "Ada": [95, 88, 92],
    "Grace": [72, 65, 80],
    "Linus": [50, 61, 58],
}
```

Return a new dictionary mapping each student's name to the **letter grade of their average**:

```python
{"Ada": "A", "Grace": "C", "Linus": "F"}
```

**Hint:** `report` can be written using the other two functions!
