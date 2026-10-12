# Employee and Manager Classes

This problem practices **inheritance**: making a new class that builds on an existing one.

## Part 1: `Employee`

Create a class called `Employee` with two properties:

* `name` — must be a non-empty string
* `salary` — must be a number greater than 0

Both properties should have getters and setters. Invalid values should raise a `ValueError`.

Add these methods:

* `give_raise(percent)` — increase the salary by `percent` percent. The new salary should be **rounded to 2 decimal places**. If `percent` is negative, raise a `ValueError`.
* `__str__` — return a string in this format (with commas and two decimal places):

```text
Ada - $85,000.00
```

**Hint:** The format code `:,.2f` adds commas and two decimal places: `f"{1234.5:,.2f}"` is `"1,234.50"`.

## Part 2: `Manager`

Create a class called `Manager` that **inherits** from `Employee`. A manager is an employee who also has a team.

* The constructor takes the same arguments as `Employee`. A new manager starts with no reports.
* `add_report(employee)` — add an `Employee` to the manager's team. If `employee` is not an `Employee` (or a subclass of it), raise a `TypeError`.
* `reports` — a property (getter only) that returns the list of employees on the team.
* `give_raise(percent)` — managers get a bonus: their raise is `percent + 5` percent.
* `__str__` — add the team size:

```text
Grace (Manager, 2 reports) - $120,000.00
```

### Example

```python
ada = Employee("Ada", 85000)
grace = Manager("Grace", 100000)
grace.add_report(ada)

ada.give_raise(10)
grace.give_raise(10)

print(ada)     # Ada - $93,500.00
print(grace)   # Grace (Manager, 1 reports) - $115,000.00
```

**Hint:** Use `super()` to reuse the parent class's code instead of copying it. For example, `Manager.give_raise` can call `super().give_raise(...)`.
