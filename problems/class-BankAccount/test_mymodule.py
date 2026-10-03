import pytest

from mymodule import BankAccount


def test_create_account_default_balance():
    account = BankAccount("Ada")

    assert account.owner == "Ada"
    assert account.balance == 0


def test_create_account_with_balance():
    account = BankAccount("Ada", 100)

    assert account.balance == 100


def test_string_representation():
    account = BankAccount("Ada", 100)

    assert str(account) == "Ada: $100.00"


def test_string_representation_cents():
    account = BankAccount("Grace", 12.5)

    assert str(account) == "Grace: $12.50"


def test_empty_owner():
    with pytest.raises(ValueError):
        BankAccount("")


def test_owner_property():
    account = BankAccount("Ada", 10)

    account.owner = "Grace"

    assert account.owner == "Grace"
    assert str(account) == "Grace: $10.00"


def test_empty_owner_property():
    account = BankAccount("Ada")

    with pytest.raises(ValueError):
        account.owner = ""


def test_negative_starting_balance():
    with pytest.raises(ValueError):
        BankAccount("Ada", -5)


def test_balance_is_read_only():
    account = BankAccount("Ada", 10)

    with pytest.raises(AttributeError):
        account.balance = 1000


def test_deposit():
    account = BankAccount("Ada")

    account.deposit(50)

    assert account.balance == 50


def test_multiple_deposits():
    account = BankAccount("Ada", 10)

    account.deposit(5)
    account.deposit(15)

    assert account.balance == 30


def test_deposit_zero():
    account = BankAccount("Ada")

    with pytest.raises(ValueError):
        account.deposit(0)


def test_deposit_negative():
    account = BankAccount("Ada", 10)

    with pytest.raises(ValueError):
        account.deposit(-5)

    assert account.balance == 10


def test_withdraw():
    account = BankAccount("Ada", 100)

    account.withdraw(30)

    assert account.balance == 70


def test_withdraw_entire_balance():
    account = BankAccount("Ada", 40)

    account.withdraw(40)

    assert account.balance == 0


def test_overdraft():
    account = BankAccount("Ada", 20)

    with pytest.raises(ValueError):
        account.withdraw(21)

    assert account.balance == 20


def test_withdraw_negative():
    account = BankAccount("Ada", 20)

    with pytest.raises(ValueError):
        account.withdraw(-5)

    assert account.balance == 20


def test_example():
    account = BankAccount("Ada", 50)

    account.deposit(25)
    account.withdraw(10)

    assert str(account) == "Ada: $65.00"
