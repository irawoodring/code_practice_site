import pytest

from mymodule import scale_recipe, servings_factor, format_ingredient

COOKIES = {
    "flour": (2.25, "cups"),
    "sugar": (0.75, "cups"),
    "eggs": (2, "whole"),
    "vanilla": (1, "tsp"),
}


def test_scale_double():
    assert scale_recipe(COOKIES, 2) == {
        "flour": (4.5, "cups"),
        "sugar": (1.5, "cups"),
        "eggs": (4, "whole"),
        "vanilla": (2, "tsp"),
    }


def test_scale_half():
    assert scale_recipe(COOKIES, 0.5) == {
        "flour": (1.12, "cups"),
        "sugar": (0.38, "cups"),
        "eggs": (1, "whole"),
        "vanilla": (0.5, "tsp"),
    }


def test_scale_rounds_to_two_places():
    result = scale_recipe({"salt": (1, "tsp")}, 1 / 3)
    assert result == {"salt": (0.33, "tsp")}


def test_scale_does_not_change_original():
    original = dict(COOKIES)
    scale_recipe(COOKIES, 3)
    assert COOKIES == original


def test_scale_empty_recipe():
    assert scale_recipe({}, 2) == {}


def test_scale_bad_factor():
    with pytest.raises(ValueError):
        scale_recipe(COOKIES, 0)
    with pytest.raises(ValueError):
        scale_recipe(COOKIES, -1)


def test_servings_factor_up():
    assert servings_factor(24, 36) == 1.5


def test_servings_factor_down():
    assert servings_factor(12, 3) == 0.25


def test_servings_factor_bad():
    with pytest.raises(ValueError):
        servings_factor(0, 10)
    with pytest.raises(ValueError):
        servings_factor(10, -2)


def test_format_decimal():
    assert format_ingredient("flour", 4.5, "cups") == "flour: 4.50 cups"


def test_format_whole_number():
    assert format_ingredient("eggs", 3, "whole") == "eggs: 3.00 whole"


def test_format_rounds():
    assert format_ingredient("salt", 0.333, "tsp") == "salt: 0.33 tsp"
