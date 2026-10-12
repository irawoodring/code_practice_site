import pytest

from mymodule import is_prime, primes_up_to, next_prime, prime_factors


def test_small_primes():
    for n in [2, 3, 5, 7, 11, 13]:
        assert is_prime(n) is True


def test_small_non_primes():
    for n in [4, 6, 8, 9, 10, 15, 21, 25]:
        assert is_prime(n) is False


def test_zero_one_and_negatives():
    assert is_prime(0) is False
    assert is_prime(1) is False
    assert is_prime(-7) is False


def test_larger_numbers():
    assert is_prime(97) is True
    assert is_prime(7919) is True
    assert is_prime(7917) is False


def test_big_prime_is_fast():
    assert is_prime(1_000_000_007) is True


def test_primes_up_to():
    assert primes_up_to(20) == [2, 3, 5, 7, 11, 13, 17, 19]


def test_primes_up_to_includes_n():
    assert primes_up_to(13) == [2, 3, 5, 7, 11, 13]


def test_primes_up_to_small():
    assert primes_up_to(1) == []
    assert primes_up_to(2) == [2]


def test_next_prime():
    assert next_prime(7) == 11
    assert next_prime(14) == 17


def test_next_prime_small():
    assert next_prime(0) == 2
    assert next_prime(-5) == 2
    assert next_prime(2) == 3


def test_prime_factors():
    assert prime_factors(12) == [2, 2, 3]
    assert prime_factors(360) == [2, 2, 2, 3, 3, 5]


def test_prime_factors_of_prime():
    assert prime_factors(13) == [13]
    assert prime_factors(2) == [2]


def test_prime_factors_large_prime_factor():
    assert prime_factors(2 * 7919) == [2, 7919]


def test_prime_factors_invalid():
    with pytest.raises(ValueError):
        prime_factors(1)

    with pytest.raises(ValueError):
        prime_factors(0)
