# Movie Class

Create a Python class called `Movie` that stores information about a movie.

A `Movie` should have three properties:

* `title` — a string containing the movie's title
* `rating` — a string that can only be `"G"`, `"PG"`, `"PG-13"`, or `"R"`
* `runtime` — an integer representing the movie's length in minutes

### Requirements

* `title` cannot be an empty string.
* `rating` must be one of `"G"`, `"PG"`, `"PG-13"`, or `"R"`.
* `runtime` must be a positive integer.
* All three properties should have both getters and setters.
* Invalid values should raise a `ValueError`.
* The class should have a `__str__` method with the following format:

```text
The Incredibles (PG) - 115 minutes
```

For example:

```python
movie = Movie("The Incredibles", "PG", 115)

print(movie)
```

should produce:

```text
The Incredibles (PG) - 115 minutes
```

The properties should be named `title`, `rating`, and `runtime`.

