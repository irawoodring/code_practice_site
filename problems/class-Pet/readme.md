# Pet Class

Create a Python class called `Pet` that stores information about a pet.

A `Pet` should have three properties:

* `name` — the pet's name, which must not be empty
* `species` — must be `"dog"`, `"cat"`, or `"bird"`
* `age` — the pet's age in years, which must be a non-negative integer

All three properties should have getters and setters.

### Requirements

* `name` must be a non-empty string.
* `species` must be `"dog"`, `"cat"`, or `"bird"`.
* `age` must be an integer greater than or equal to 0.
* Invalid values should raise a `ValueError`.
* The class should have a `__str__` method.

The string representation should have this format:

```text
Buddy (dog), 5 years old
```

For example:

```python
pet = Pet("Buddy", "dog", 5)
print(pet)
```

should produce:

```text
Buddy (dog), 5 years old
```

### `birthday` Method

Add a method called:

```python
birthday()
```

Each time `birthday()` is called, the pet's age should increase by 1.

For example:

```python
pet = Pet("Buddy", "dog", 5)

pet.birthday()

print(pet.age)
```

should print:

```text
6
```

The method should not take any arguments other than `self`.

