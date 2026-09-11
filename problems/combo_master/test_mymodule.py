from combo_master import longest_combo


def test_simple_combo():
    assert longest_combo("HHMHHHHM") == 4


def test_all_hits():
    assert longest_combo("HHHH") == 4


def test_no_hits():
    assert longest_combo("MMMM") == 0


def test_alternating():
    assert longest_combo("MHMHM") == 1


def test_combo_at_beginning():
    assert longest_combo("HHHMMH") == 3


def test_combo_at_end():
    assert longest_combo("MHHHH") == 4


def test_multiple_combos():
    assert longest_combo("HHMHHHHMHH") == 4


def test_longest_combo_is_first():
    assert longest_combo("HHHHMHHMHHH") == 4


def test_longest_combo_is_last():
    assert longest_combo("HMHHMHHHH") == 4


def test_single_hit():
    assert longest_combo("H") == 1


def test_single_miss():
    assert longest_combo("M") == 0


def test_empty_game():
    assert longest_combo("") == 0
