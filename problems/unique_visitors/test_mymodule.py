from mymodule import unique_count, visited_both, only_first_day, everyone

MONDAY = ["Ada", "Grace", "Ada", "Linus", "Grace"]
TUESDAY = ["Linus", "Margaret", "Linus"]


def test_unique_count_example():
    assert unique_count(MONDAY) == 3


def test_unique_count_empty():
    assert unique_count([]) == 0


def test_unique_count_all_same():
    assert unique_count(["Bo", "Bo", "Bo"]) == 1


def test_visited_both_example():
    assert visited_both(MONDAY, TUESDAY) == ["Linus"]


def test_visited_both_sorted():
    assert visited_both(["Zed", "Amy", "Kim"], ["Kim", "Zed", "Amy"]) == ["Amy", "Kim", "Zed"]


def test_visited_both_none():
    assert visited_both(["Ada"], ["Grace"]) == []


def test_only_first_day_example():
    assert only_first_day(MONDAY, TUESDAY) == ["Ada", "Grace"]


def test_only_first_day_reverse():
    assert only_first_day(TUESDAY, MONDAY) == ["Margaret"]


def test_only_first_day_empty_second():
    assert only_first_day(["Bo", "Al", "Bo"], []) == ["Al", "Bo"]


def test_everyone_example():
    assert everyone([MONDAY, TUESDAY]) == ["Ada", "Grace", "Linus", "Margaret"]


def test_everyone_three_days():
    days = [["Cy"], ["Bo", "Cy"], ["Al"]]
    assert everyone(days) == ["Al", "Bo", "Cy"]


def test_everyone_no_days():
    assert everyone([]) == []


def test_inputs_not_changed():
    day1 = ["Ada", "Ada", "Grace"]
    day2 = ["Grace"]
    visited_both(day1, day2)
    only_first_day(day1, day2)
    everyone([day1, day2])
    assert day1 == ["Ada", "Ada", "Grace"]
    assert day2 == ["Grace"]
