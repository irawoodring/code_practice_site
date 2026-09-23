```python
import pytest

from mymodule import extract_treasure_code


def test_treasure():
    assert extract_treasure_code(
        "12345TREASURE9876"
    ) == "TREASURE"


def test_gold_coin():
    assert extract_treasure_code(
        "999GOLDCOIN123"
    ) == "GOLDCOIN"


def test_lost_map():
    assert extract_treasure_code(
        "123THELOSTMAP456"
    ) == "THELOSTMAP"


def test_short_code():
    assert extract_treasure_code(
        "7X42"
    ) == "X"


def test_long_code():
    assert extract_treasure_code(
        "987654THEANCIENTPIRATECHESTCODE12345"
    ) == "THEANCIENTPIRATECHESTCODE"


def test_code_with_spaces():
    assert extract_treasure_code(
        "123FIND THE GOLD456"
    ) == "FIND THE GOLD"


def test_code_with_symbols():
    assert extract_treasure_code(
        "999$TREASURE!42"
    ) == "$TREASURE!"


def test_different_positions():
    assert extract_treasure_code(
        "1SECRET987654321"
    ) == "SECRET"


def test_single_character():
    assert extract_treasure_code(
        "123A456"
    ) == "A"


def test_large_numbers_around_code():
    assert extract_treasure_code(
        "1234567890PIRATESROCK9876543210"
    ) == "PIRATESROCK"
```

