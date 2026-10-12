# Pizza Party

You're ordering pizza for the computer science club. The problems below have one thing in common: the answer is built from **every possible choice**. A great way to solve them is **recursion with backtracking**:

1. Make a choice (for example, "put pepperoni on" or "leave pepperoni off").
2. Recursively solve the rest of the problem with that choice made.
3. Undo the choice and try the next one.

Don't use the `itertools` module. The tests check this!

## Your Mission

### 1. `topping_combos(toppings)`

Return a list of **every possible combination** of toppings, including no toppings at all. Each combination is a list, and its toppings stay in the same order as in `toppings`. The combinations themselves may be in any order.

```python
topping_combos(["ham", "olive"])
# [[], ["ham"], ["olive"], ["ham", "olive"]]   (in any order)
```

A list of `n` toppings has `2 ** n` combinations.

### 2. `slice_orders(friends)`

Your friends are lining up to grab a slice. Return a list of **every possible order** they could line up in. Each order is a list, and the orders may be in any order.

```python
slice_orders(["Ada", "Bo", "Cy"])
# [["Ada", "Bo", "Cy"], ["Ada", "Cy", "Bo"], ["Bo", "Ada", "Cy"],
#  ["Bo", "Cy", "Ada"], ["Cy", "Ada", "Bo"], ["Cy", "Bo", "Ada"]]
```

A list of `n` friends has `n!` orders.

### 3. `best_order(prices, budget)`

`prices` is a list of whole-dollar prices for the items on the menu. Each item can be bought at most once. Return the **largest total you can spend without going over** `budget`.

```python
best_order([8, 6, 5, 3], 12)   # 11  (8 + 3, or 6 + 5)
best_order([8, 6, 5, 3], 30)   # 22  (buy everything)
best_order([20, 30], 10)       # 0   (can't afford anything)
```

**Hint:** For `best_order`, you don't need to build every combination. Write a recursive helper that decides about one item at a time ("buy it" or "skip it") and keeps track of how much money is left. If an item costs more than the money left, skip the "buy it" branch. That's the backtracking!
