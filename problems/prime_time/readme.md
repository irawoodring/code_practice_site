# Prime Time

A **prime number** is a whole number greater than 1 whose only divisors are 1 and itself. The first few primes are:

```text
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, ...
```

Numbers like `1`, `0`, and negative numbers are **not** prime.

## Your Mission

Write four functions.

### 1. `is_prime(n)`

Return `True` if `n` is prime, otherwise `False`.

```python
is_prime(7)    # True
is_prime(9)    # False
is_prime(1)    # False
```

### 2. `primes_up_to(n)`

Return a list of every prime number less than or equal to `n`, in increasing order.

```python
primes_up_to(20)   # [2, 3, 5, 7, 11, 13, 17, 19]
primes_up_to(1)    # []
```

### 3. `next_prime(n)`

Return the smallest prime number that is **greater than** `n`.

```python
next_prime(7)    # 11
next_prime(14)   # 17
next_prime(-5)   # 2
```

### 4. `prime_factors(n)`

Return a list of the prime numbers that multiply together to make `n`, in increasing order. A factor appears as many times as it divides `n`.

```python
prime_factors(12)    # [2, 2, 3]     because 2 * 2 * 3 = 12
prime_factors(13)    # [13]
prime_factors(360)   # [2, 2, 2, 3, 3, 5]
```

If `n` is less than 2, raise a `ValueError`.

**Hint:** To check whether `n` is prime, you only need to test divisors up to the square root of `n`. Can you use `is_prime` to write the other functions?
