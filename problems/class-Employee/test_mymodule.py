import pytest

from mymodule import Employee, Manager


def test_create_employee():
    e = Employee("Ada", 85000)

    assert e.name == "Ada"
    assert e.salary == 85000


def test_employee_str():
    assert str(Employee("Ada", 85000)) == "Ada - $85,000.00"
    assert str(Employee("Bo", 999.5)) == "Bo - $999.50"


def test_employee_setters():
    e = Employee("Ada", 85000)

    e.name = "Ada L."
    e.salary = 90000

    assert e.name == "Ada L."
    assert e.salary == 90000


def test_invalid_name():
    with pytest.raises(ValueError):
        Employee("", 50000)

    e = Employee("Ada", 50000)
    with pytest.raises(ValueError):
        e.name = ""


def test_invalid_salary():
    with pytest.raises(ValueError):
        Employee("Ada", 0)

    e = Employee("Ada", 50000)
    with pytest.raises(ValueError):
        e.salary = -10


def test_give_raise():
    e = Employee("Ada", 85000)

    e.give_raise(10)

    assert e.salary == pytest.approx(93500)


def test_give_raise_rounds():
    e = Employee("Ada", 33333.33)

    e.give_raise(3)

    assert e.salary == 34333.33


def test_give_raise_zero():
    e = Employee("Ada", 50000)

    e.give_raise(0)

    assert e.salary == 50000


def test_give_raise_negative():
    e = Employee("Ada", 50000)

    with pytest.raises(ValueError):
        e.give_raise(-5)

    assert e.salary == 50000


def test_manager_is_employee():
    m = Manager("Grace", 100000)

    assert isinstance(m, Employee)
    assert m.name == "Grace"
    assert m.salary == 100000


def test_manager_validation_inherited():
    with pytest.raises(ValueError):
        Manager("", 100000)

    with pytest.raises(ValueError):
        Manager("Grace", -1)


def test_manager_starts_with_no_reports():
    assert Manager("Grace", 100000).reports == []


def test_add_report():
    m = Manager("Grace", 100000)
    a = Employee("Ada", 85000)
    b = Employee("Bo", 60000)

    m.add_report(a)
    m.add_report(b)

    assert m.reports == [a, b]


def test_manager_can_report_to_manager():
    boss = Manager("Grace", 150000)
    mid = Manager("Lin", 110000)

    boss.add_report(mid)

    assert boss.reports == [mid]


def test_add_report_type_error():
    m = Manager("Grace", 100000)

    with pytest.raises(TypeError):
        m.add_report("Ada")


def test_managers_have_separate_teams():
    m1 = Manager("Grace", 100000)
    m2 = Manager("Lin", 100000)

    m1.add_report(Employee("Ada", 85000))

    assert len(m1.reports) == 1
    assert len(m2.reports) == 0


def test_manager_raise_bonus():
    m = Manager("Grace", 100000)

    m.give_raise(10)

    assert m.salary == pytest.approx(115000)


def test_manager_raise_negative():
    m = Manager("Grace", 100000)

    with pytest.raises(ValueError):
        m.give_raise(-10)


def test_manager_str():
    m = Manager("Grace", 120000)
    m.add_report(Employee("Ada", 85000))
    m.add_report(Employee("Bo", 60000))

    assert str(m) == "Grace (Manager, 2 reports) - $120,000.00"


def test_example():
    ada = Employee("Ada", 85000)
    grace = Manager("Grace", 100000)
    grace.add_report(ada)

    ada.give_raise(10)
    grace.give_raise(10)

    assert str(ada) == "Ada - $93,500.00"
    assert str(grace) == "Grace (Manager, 1 reports) - $115,000.00"
