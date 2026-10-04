import pytest

from mymodule import final_position, distance_home, visits_twice


def test_no_commands():
    assert final_position("") == (0, 0)


def test_single_moves():
    assert final_position("N") == (0, 1)
    assert final_position("S") == (0, -1)
    assert final_position("E") == (1, 0)
    assert final_position("W") == (-1, 0)


def test_example():
    assert final_position("NNEE") == (2, 2)


def test_loop_returns_home():
    assert final_position("NESW") == (0, 0)


def test_negative_coordinates():
    assert final_position("SSSWW") == (-2, -3)


def test_lowercase():
    assert final_position("nnee") == (2, 2)


def test_invalid_command():
    with pytest.raises(ValueError):
        final_position("NNX")


def test_distance_home():
    assert distance_home("NNEE") == 4
    assert distance_home("NNWWWS") == 4


def test_distance_home_zero():
    assert distance_home("") == 0
    assert distance_home("NSEW") == 0


def test_visits_twice_false():
    assert visits_twice("NES") is False
    assert visits_twice("") is False


def test_visits_twice_back_to_start():
    assert visits_twice("NESW") is True


def test_visits_twice_back_and_forth():
    assert visits_twice("NS") is True


def test_visits_twice_later_in_path():
    assert visits_twice("EEENWSS") is True


def test_long_path_no_repeats():
    assert visits_twice("NNNNEEEESSSS") is False
