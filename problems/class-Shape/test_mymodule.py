import math

import pytest

from mymodule import Shape, Circle, Rectangle, Square, total_area


def test_shape_name():
    assert Shape("blob").name == "blob"


def test_shape_area_zero():
    assert Shape("blob").area() == 0


def test_shape_str():
    assert str(Shape("blob")) == "blob with area 0.00"


def test_circle_is_shape():
    assert isinstance(Circle(1), Shape)


def test_circle_name():
    assert Circle(1).name == "circle"


def test_circle_area():
    assert Circle(2).area() == pytest.approx(math.pi * 4)


def test_circle_str():
    assert str(Circle(2)) == "circle with area 12.57"


def test_circle_bad_radius():
    with pytest.raises(ValueError):
        Circle(0)
    with pytest.raises(ValueError):
        Circle(-1)


def test_rectangle_is_shape():
    assert isinstance(Rectangle(1, 2), Shape)


def test_rectangle_area():
    assert Rectangle(3, 4).area() == 12


def test_rectangle_str():
    assert str(Rectangle(3, 4)) == "rectangle with area 12.00"


def test_rectangle_bad_sides():
    with pytest.raises(ValueError):
        Rectangle(0, 4)
    with pytest.raises(ValueError):
        Rectangle(3, -4)


def test_square_is_rectangle():
    square = Square(5)
    assert isinstance(square, Rectangle)
    assert isinstance(square, Shape)


def test_square_name():
    assert Square(5).name == "square"


def test_square_area():
    assert Square(5).area() == 25


def test_square_str():
    assert str(Square(5)) == "square with area 25.00"


def test_square_bad_side():
    with pytest.raises(ValueError):
        Square(0)


def test_total_area():
    shapes = [Circle(2), Rectangle(3, 4), Square(5)]
    assert total_area(shapes) == pytest.approx(math.pi * 4 + 12 + 25)


def test_total_area_empty():
    assert total_area([]) == 0
