import pytest

from softdrink import Softdrink


def test_valid_softdrink():
    drink = Softdrink("Dr. Pepper", 20, 1.99)

    assert drink.drink_name == "Dr. Pepper"
    assert drink.ounces == 20
    assert drink.cost == 1.99
    assert str(drink) == "20 ounce Dr. Pepper - $1.99"


def test_mt_dew():
    drink = Softdrink("Mt. Dew", 12, 1.25)

    assert drink.drink_name == "Mt. Dew"
    assert drink.ounces == 12
    assert drink.cost == 1.25
    assert str(drink) == "12 ounce Mt. Dew - $1.25"


def test_diet_pepsi():
    drink = Softdrink("Diet Pepsi", 32, 2.50)

    assert drink.drink_name == "Diet Pepsi"
    assert drink.ounces == 32
    assert drink.cost == 2.50
    assert str(drink) == "32 ounce Diet Pepsi - $2.50"


def test_drink_name_property_can_be_changed():
    drink = Softdrink("Mt. Dew", 20, 1.99)

    drink.drink_name = "Dr. Pepper"

    assert drink.drink_name == "Dr. Pepper"
    assert str(drink) == "20 ounce Dr. Pepper - $1.99"


def test_ounces_property_can_be_changed():
    drink = Softdrink("Mt. Dew", 20, 1.99)

    drink.ounces = 32

    assert drink.ounces == 32
    assert str(drink) == "32 ounce Mt. Dew - $1.99"


def test_cost_property_can_be_changed():
    drink = Softdrink("Mt. Dew", 20, 1.99)

    drink.cost = 2.49

    assert drink.cost == 2.49
    assert str(drink) == "20 ounce Mt. Dew - $2.49"


def test_all_valid_sizes():
    for size in [12, 16, 20, 32]:
        drink = Softdrink("Mt. Dew", size, 1.50)
        assert drink.ounces == size
        assert str(drink) == f"{size} ounce Mt. Dew - $1.50"


def test_zero_cost_is_valid():
    drink = Softdrink("Diet Pepsi", 12, 0.0)

    assert drink.cost == 0.0
    assert str(drink) == "12 ounce Diet Pepsi - $0.00"


def test_cost_is_formatted_to_two_decimal_places():
    drink = Softdrink("Mt. Dew", 16, 2.5)

    assert str(drink) == "16 ounce Mt. Dew - $2.50"


def test_invalid_drink_name_in_constructor():
    with pytest.raises(ValueError):
        Softdrink("Coke", 20, 1.99)


def test_invalid_drink_name_in_property():
    drink = Softdrink("Mt. Dew", 20, 1.99)

    with pytest.raises(ValueError):
        drink.drink_name = "Coke"


def test_invalid_ounces_in_constructor():
    with pytest.raises(ValueError):
        Softdrink("Mt. Dew", 24, 1.99)


def test_invalid_ounces_in_property():
    drink = Softdrink("Mt. Dew", 20, 1.99)

    with pytest.raises(ValueError):
        drink.ounces = 24


def test_non_integer_ounces():
    with pytest.raises((ValueError, TypeError)):
        Softdrink("Mt. Dew", 20.0, 1.99)


def test_negative_cost_in_constructor():
    with pytest.raises(ValueError):
        Softdrink("Dr. Pepper", 20, -1.00)


def test_negative_cost_in_property():
    drink = Softdrink("Dr. Pepper", 20, 1.99)

    with pytest.raises(ValueError):
        drink.cost = -0.01
