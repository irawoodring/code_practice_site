import pytest

from mymodule import Rectangle


def test_create_rectangle():
    r = Rectangle(3, 4)

    assert r.width == 3
    assert r.height == 4


def test_string_representation():
    assert str(Rectangle(3, 4)) == "Rectangle(3 x 4)"


def test_area():
    assert Rectangle(3, 4).area() == 12
    assert Rectangle(5, 5).area() == 25


def test_perimeter():
    assert Rectangle(3, 4).perimeter() == 14
    assert Rectangle(1, 10).perimeter() == 22


def test_decimal_sides():
    r = Rectangle(2.5, 4)

    assert r.area() == 10.0


def test_is_square():
    assert Rectangle(5, 5).is_square() is True
    assert Rectangle(3, 4).is_square() is False


def test_width_property():
    r = Rectangle(3, 4)

    r.width = 10

    assert r.width == 10
    assert r.area() == 40


def test_height_property():
    r = Rectangle(3, 4)

    r.height = 3

    assert r.height == 3
    assert r.is_square() is True


def test_zero_width():
    with pytest.raises(ValueError):
        Rectangle(0, 4)


def test_negative_height():
    with pytest.raises(ValueError):
        Rectangle(3, -1)


def test_invalid_width_property():
    r = Rectangle(3, 4)

    with pytest.raises(ValueError):
        r.width = -2


def test_invalid_height_property():
    r = Rectangle(3, 4)

    with pytest.raises(ValueError):
        r.height = 0


def test_scale():
    r = Rectangle(3, 4)

    r.scale(2)

    assert r.width == 6
    assert r.height == 8
    assert str(r) == "Rectangle(6 x 8)"


def test_scale_down():
    r = Rectangle(4, 8)

    r.scale(0.5)

    assert r.area() == 8


def test_invalid_scale():
    r = Rectangle(3, 4)

    with pytest.raises(ValueError):
        r.scale(0)

    with pytest.raises(ValueError):
        r.scale(-1)


def test_equal_rectangles():
    assert Rectangle(3, 4) == Rectangle(3, 4)


def test_unequal_rectangles():
    assert Rectangle(3, 4) != Rectangle(4, 3)
    assert Rectangle(3, 4) != Rectangle(3, 5)
