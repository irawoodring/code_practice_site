# Recipe Scaler

## The Story

Grandma's cookie recipe makes 24 cookies, but you need enough for the whole class! A recipe is stored as a dictionary mapping each ingredient to a **tuple** of `(amount, unit)`:

```python
cookies = {
    "flour": (2.25, "cups"),
    "sugar": (0.75, "cups"),
    "eggs": (2, "whole"),
    "vanilla": (1, "tsp"),
}
```

---

## Your Mission

### 1. `scale_recipe(recipe, factor)`

Return a **new** recipe dictionary with every amount multiplied by `factor`. Round each new amount to **2 decimal places**. Units stay the same. Do **not** change the original recipe.

```python
scale_recipe(cookies, 2)
# {"flour": (4.5, "cups"), "sugar": (1.5, "cups"), "eggs": (4, "whole"), "vanilla": (2, "tsp")}
```

If `factor` is not greater than `0`, raise a `ValueError`.

### 2. `servings_factor(original, wanted)`

Return the factor needed to turn a recipe that makes `original` servings into one that makes `wanted` servings.

```python
servings_factor(24, 36)   # 1.5
```

If either number is not greater than `0`, raise a `ValueError`.

### 3. `format_ingredient(name, amount, unit)`

Return a line for a printed recipe card. Amounts always show **two decimal places**:

```python
format_ingredient("flour", 4.5, "cups")   # "flour: 4.50 cups"
format_ingredient("eggs", 3, "whole")     # "eggs: 3.00 whole"
```

**Hint:** `round(value, 2)` rounds a number, and an f-string like `f"{value:.2f}"` formats one with two decimal places. You can unpack a tuple with `amount, unit = recipe["flour"]`.
