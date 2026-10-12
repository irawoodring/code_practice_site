import ast
import inspect
import linecache

import pytest

import mymodule
from mymodule import Fraction

# Make sure inspect sees the latest version of mymodule.py on every run.
linecache.clearcache()


def parts(f):
    return (f.numerator, f.denominator)


def test_create():
    assert parts(Fraction(3, 4)) == (3, 4)


def test_default_denominator():
    assert parts(Fraction(5)) == (5, 1)


def test_reduces():
    assert parts(Fraction(6, 8)) == (3, 4)
    assert parts(Fraction(10, 5)) == (2, 1)
    assert parts(Fraction(0, 7)) == (0, 1)


def test_negative_denominator():
    assert parts(Fraction(1, -2)) == (-1, 2)
    assert parts(Fraction(-3, -9)) == (1, 3)


def test_zero_denominator():
    with pytest.raises(ZeroDivisionError):
        Fraction(1, 0)


def test_type_checks():
    with pytest.raises(TypeError):
        Fraction(1.5, 2)

    with pytest.raises(TypeError):
        Fraction(1, "2")


def test_read_only():
    f = Fraction(1, 2)

    with pytest.raises(AttributeError):
        f.numerator = 5

    with pytest.raises(AttributeError):
        f.denominator = 5


def test_str():
    assert str(Fraction(3, 4)) == "3/4"
    assert str(Fraction(-1, 2)) == "-1/2"
    assert str(Fraction(10, 5)) == "2"
    assert str(Fraction(0, 3)) == "0"


def test_add():
    assert parts(Fraction(1, 2) + Fraction(1, 3)) == (5, 6)
    assert parts(Fraction(1, 4) + Fraction(1, 4)) == (1, 2)


def test_sub():
    assert parts(Fraction(1, 2) - Fraction(3, 4)) == (-1, 4)
    assert parts(Fraction(1, 2) - Fraction(1, 2)) == (0, 1)


def test_mul():
    assert parts(Fraction(2, 3) * Fraction(3, 4)) == (1, 2)
    assert parts(Fraction(-2, 3) * Fraction(3, 5)) == (-2, 5)


def test_div():
    assert parts(Fraction(1, 2) / Fraction(1, 4)) == (2, 1)
    assert parts(Fraction(3, 4) / Fraction(-3, 2)) == (-1, 2)


def test_div_by_zero():
    with pytest.raises(ZeroDivisionError):
        Fraction(1, 2) / Fraction(0)

    with pytest.raises(ZeroDivisionError):
        Fraction(1, 2) / 0


def test_operators_with_ints():
    assert parts(Fraction(1, 2) + 1) == (3, 2)
    assert parts(Fraction(1, 2) - 1) == (-1, 2)
    assert parts(Fraction(1, 2) * 4) == (2, 1)
    assert parts(Fraction(1, 2) / 2) == (1, 4)


def test_operators_return_new_fraction():
    a = Fraction(1, 2)
    b = Fraction(1, 3)

    c = a + b

    assert isinstance(c, Fraction)
    assert parts(a) == (1, 2)
    assert parts(b) == (1, 3)


def test_exact_math():
    total = Fraction(0)
    for _ in range(10):
        total = total + Fraction(1, 10)

    assert total == 1


def test_eq():
    assert Fraction(1, 2) == Fraction(2, 4)
    assert Fraction(4, 2) == 2
    assert not (Fraction(1, 2) == Fraction(1, 3))
    assert Fraction(1, 2) != Fraction(1, 3)


def test_lt():
    assert Fraction(1, 3) < Fraction(1, 2)
    assert not (Fraction(1, 2) < Fraction(1, 3))
    assert Fraction(-1, 2) < 0
    assert not (Fraction(1, 2) < Fraction(2, 4))


def test_gt_works_through_lt():
    assert Fraction(1, 2) > Fraction(1, 3)


def test_float():
    assert float(Fraction(1, 4)) == 0.25
    assert float(Fraction(-3, 2)) == -1.5


def test_does_not_use_fractions_module():
    tree = ast.parse(inspect.getsource(mymodule))

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names = [alias.name for alias in node.names]
        elif isinstance(node, ast.ImportFrom):
            names = [node.module]
        else:
            continue
        assert "fractions" not in names, "write your own Fraction class instead of using the fractions module"
