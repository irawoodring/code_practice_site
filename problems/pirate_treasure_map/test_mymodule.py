from mymodule import treasure_location


def test_largest_in_middle():
    assert treasure_location([3, 7, 2, 9, 4]) == 3


def test_largest_at_beginning():
    assert treasure_location([10, 5, 8]) == 0


def test_largest_at_end():
    assert treasure_location([1, 2, 3, 4]) == 3


def test_largest_in_first_position():
    assert treasure_location([100, 20, 30, 40]) == 0


def test_repeated_largest():
    assert treasure_location([4, 9, 2, 9, 5]) == 1


def test_all_same():
    assert treasure_location([7, 7, 7, 7]) == 0


def test_negative_numbers():
    assert treasure_location([-10, -3, -20, -5]) == 1


def test_single_number():
    assert treasure_location([42]) == 0


def test_two_numbers():
    assert treasure_location([5, 10]) == 1
