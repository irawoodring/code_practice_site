import pytest

from mymodule import countdown, fuel_burns, orbit_steps


def test_countdown_example():
    assert countdown(5) == [5, 4, 3, 2, 1, "Liftoff!"]


def test_countdown_one():
    assert countdown(1) == [1, "Liftoff!"]


def test_countdown_zero():
    assert countdown(0) == ["Liftoff!"]


def test_countdown_ten_length():
    result = countdown(10)
    assert len(result) == 11
    assert result[0] == 10


def test_countdown_negative():
    with pytest.raises(ValueError):
        countdown(-1)


def test_fuel_burns_leftover():
    assert fuel_burns(100, 30) == 3


def test_fuel_burns_exact():
    assert fuel_burns(90, 30) == 3


def test_fuel_burns_not_enough():
    assert fuel_burns(10, 30) == 0


def test_fuel_burns_empty_tank():
    assert fuel_burns(0, 5) == 0


def test_fuel_burns_decimal():
    assert fuel_burns(10, 2.5) == 4


def test_fuel_burns_bad_rate():
    with pytest.raises(ValueError):
        fuel_burns(100, 0)
    with pytest.raises(ValueError):
        fuel_burns(100, -5)


def test_orbit_steps_one():
    assert orbit_steps(1) == 0


def test_orbit_steps_two():
    assert orbit_steps(2) == 1


def test_orbit_steps_six():
    assert orbit_steps(6) == 8


def test_orbit_steps_twenty_seven():
    assert orbit_steps(27) == 111


def test_orbit_steps_invalid():
    with pytest.raises(ValueError):
        orbit_steps(0)
