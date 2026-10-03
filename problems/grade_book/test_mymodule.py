import pytest

from mymodule import letter_grade, average, report


def test_letter_grade_a():
    assert letter_grade(95) == "A"
    assert letter_grade(100) == "A"
    assert letter_grade(90) == "A"


def test_letter_grade_b():
    assert letter_grade(89.99) == "B"
    assert letter_grade(80) == "B"


def test_letter_grade_c():
    assert letter_grade(75) == "C"
    assert letter_grade(70) == "C"


def test_letter_grade_d():
    assert letter_grade(69) == "D"
    assert letter_grade(60) == "D"


def test_letter_grade_f():
    assert letter_grade(59.9) == "F"
    assert letter_grade(0) == "F"


def test_letter_grade_invalid():
    with pytest.raises(ValueError):
        letter_grade(-1)

    with pytest.raises(ValueError):
        letter_grade(101)


def test_average():
    assert average([90, 80, 70]) == 80.0


def test_average_single():
    assert average([77]) == 77


def test_average_decimal():
    assert average([1, 2]) == 1.5


def test_average_empty():
    assert average([]) == 0


def test_report_example():
    grades = {
        "Ada": [95, 88, 92],
        "Grace": [72, 65, 80],
        "Linus": [50, 61, 58],
    }

    assert report(grades) == {"Ada": "A", "Grace": "C", "Linus": "F"}


def test_report_borderline():
    grades = {"Sam": [79, 81]}

    assert report(grades) == {"Sam": "B"}


def test_report_empty():
    assert report({}) == {}


def test_report_does_not_change_input():
    grades = {"Ada": [95, 88, 92]}

    report(grades)

    assert grades == {"Ada": [95, 88, 92]}
