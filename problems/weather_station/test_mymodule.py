import pytest

from mymodule import days_above, high_low, biggest_swing, moving_average


TEMPS = [61, 64, 70, 58, 57, 66, 72]


def test_days_above():
    assert days_above(TEMPS, 65) == 3


def test_days_above_is_strict():
    assert days_above(TEMPS, 66) == 2


def test_days_above_none_and_all():
    assert days_above(TEMPS, 100) == 0
    assert days_above(TEMPS, 0) == 7
    assert days_above([], 50) == 0


def test_high_low():
    assert high_low(TEMPS) == (72, 57)


def test_high_low_single_day():
    assert high_low([40]) == (40, 40)


def test_high_low_negative():
    assert high_low([-5, -12, 3, -1]) == (3, -12)


def test_high_low_empty():
    with pytest.raises(ValueError):
        high_low([])


def test_biggest_swing_drop():
    assert biggest_swing(TEMPS) == (3, -12)


def test_biggest_swing_rise():
    assert biggest_swing([50, 52, 70, 69]) == (2, 18)


def test_biggest_swing_tie_returns_earlier():
    assert biggest_swing([50, 60, 50]) == (1, 10)


def test_biggest_swing_two_days():
    assert biggest_swing([30, 25]) == (1, -5)


def test_biggest_swing_too_short():
    assert biggest_swing([70]) is None
    assert biggest_swing([]) is None


def test_moving_average():
    assert moving_average([61, 64, 70, 58, 57], 3) == [65.0, 64.0, 61.7]


def test_moving_average_window_one():
    assert moving_average([61, 64, 70], 1) == [61, 64, 70]


def test_moving_average_whole_list():
    assert moving_average([10, 20, 30, 42], 4) == [25.5]


def test_moving_average_length():
    assert len(moving_average(TEMPS, 2)) == 6


def test_moving_average_bad_window():
    with pytest.raises(ValueError):
        moving_average(TEMPS, 0)

    with pytest.raises(ValueError):
        moving_average(TEMPS, 8)
