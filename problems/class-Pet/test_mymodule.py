import pytest

from mymodule import Pet


def test_create_pet():
    pet = Pet("Buddy", "dog", 5)

    assert pet.name == "Buddy"
    assert pet.species == "dog"
    assert pet.age == 5


def test_string_representation():
    pet = Pet("Buddy", "dog", 5)

    assert str(pet) == "Buddy (dog), 5 years old"


def test_all_valid_species():
    for species in ["dog", "cat", "bird"]:
        pet = Pet("Sam", species, 3)
        assert pet.species == species


def test_name_property():
    pet = Pet("Buddy", "dog", 5)

    pet.name = "Max"

    assert pet.name == "Max"
    assert str(pet) == "Max (dog), 5 years old"


def test_species_property():
    pet = Pet("Buddy", "dog", 5)

    pet.species = "cat"

    assert pet.species == "cat"


def test_age_property():
    pet = Pet("Buddy", "dog", 5)

    pet.age = 10

    assert pet.age == 10


def test_empty_name():
    with pytest.raises(ValueError):
        Pet("", "dog", 5)


def test_empty_name_property():
    pet = Pet("Buddy", "dog", 5)

    with pytest.raises(ValueError):
        pet.name = ""


def test_invalid_species():
    with pytest.raises(ValueError):
        Pet("Buddy", "fish", 5)


def test_invalid_species_property():
    pet = Pet("Buddy", "dog", 5)

    with pytest.raises(ValueError):
        pet.species = "fish"


def test_negative_age():
    with pytest.raises(ValueError):
        Pet("Buddy", "dog", -1)


def test_negative_age_property():
    pet = Pet("Buddy", "dog", 5)

    with pytest.raises(ValueError):
        pet.age = -1


def test_zero_age_is_valid():
    pet = Pet("Baby", "cat", 0)

    assert pet.age == 0


def test_age_must_be_integer():
    with pytest.raises((ValueError, TypeError)):
        Pet("Buddy", "dog", 5.5)


def test_birthday():
    pet = Pet("Buddy", "dog", 5)

    pet.birthday()

    assert pet.age == 6


def test_multiple_birthdays():
    pet = Pet("Buddy", "dog", 5)

    pet.birthday()
    pet.birthday()
    pet.birthday()

    assert pet.age == 8


def test_birthday_updates_string():
    pet = Pet("Buddy", "dog", 5)

    pet.birthday()

    assert str(pet) == "Buddy (dog), 6 years old"
