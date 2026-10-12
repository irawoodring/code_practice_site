import pytest

from mymodule import tip_amount, total, split


def test_tip_default_percent():
    assert tip_amount(50) == pytest.approx(9.0)
    assert tip_amount(100) == pytest.approx(18.0)


def test_tip_custom_percent():
    assert tip_amount(50, 20) == pytest.approx(10.0)
    assert tip_amount(80, 15) == pytest.approx(12.0)


def test_tip_rounds_to_cents():
    assert tip_amount(42.40, 15) == pytest.approx(6.36)
    assert tip_amount(33.33) == pytest.approx(6.0)


def test_tip_zero():
    assert tip_amount(0) == 0
    assert tip_amount(50, 0) == 0


def test_total_default_percent():
    assert total(50) == pytest.approx(59.0)


def test_total_custom_percent():
    assert total(40, 25) == pytest.approx(50.0)
    assert total(42.40, 15) == pytest.approx(48.76)


def test_split():
    assert split(100, 4) == pytest.approx(29.5)


def test_split_custom_percent():
    assert split(60, 3, 20) == pytest.approx(24.0)


def test_split_one_person():
    assert split(50, 1) == pytest.approx(total(50))


def test_split_rounds_to_cents():
    assert split(100, 3, 0) == pytest.approx(33.33)


def test_negative_bill():
    with pytest.raises(ValueError):
        tip_amount(-10)

    with pytest.raises(ValueError):
        total(-10)


def test_negative_percent():
    with pytest.raises(ValueError):
        tip_amount(50, -5)


def test_split_bad_people():
    with pytest.raises(ValueError):
        split(100, 0)

    with pytest.raises(ValueError):
        split(100, -2)
