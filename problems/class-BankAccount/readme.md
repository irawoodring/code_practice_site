# BankAccount Class

Create a Python class called `BankAccount` that keeps track of money in a bank account.

A `BankAccount` should have two properties:

* `owner` — the name of the account owner, which must not be empty
* `balance` — the amount of money in the account

The constructor should take the owner's name and an **optional** starting balance that defaults to `0`:

```python
account = BankAccount("Ada")          # balance is 0
account = BankAccount("Ada", 100)     # balance is 100
```

### Requirements

* `owner` must be a non-empty string. It should have a getter and a setter.
* `balance` should have a getter but **no setter**. The only way to change the balance is through `deposit` and `withdraw`.
* The starting balance must not be negative.
* Invalid values should raise a `ValueError`.
* The class should have a `__str__` method.

The string representation should have this format (always two decimal places):

```text
Ada: $100.00
```

### `deposit` Method

```python
deposit(amount)
```

Adds `amount` to the balance. The amount must be greater than 0, otherwise raise a `ValueError`.

### `withdraw` Method

```python
withdraw(amount)
```

Subtracts `amount` from the balance. Raise a `ValueError` if:

* the amount is not greater than 0, or
* the amount is more than the current balance (no overdrafts!)

If a withdrawal fails, the balance should not change.

### Example

```python
account = BankAccount("Ada", 50)
account.deposit(25)
account.withdraw(10)
print(account)
```

should print:

```text
Ada: $65.00
```

**Hint:** To make a read-only property, use `@property` without writing a matching `@balance.setter`.
