import pytest

from mymodule import Movie


def test_create_movie():
    movie = Movie("The Incredibles", "PG", 115)

    assert movie.title == "The Incredibles"
    assert movie.rating == "PG"
    assert movie.runtime == 115


def test_string_representation():
    movie = Movie("The Incredibles", "PG", 115)

    assert str(movie) == "The Incredibles (PG) - 115 minutes"


def test_all_valid_ratings():
    for rating in ["G", "PG", "PG-13", "R"]:
        movie = Movie("Test Movie", rating, 100)
        assert movie.rating == rating


def test_title_property():
    movie = Movie("Old Title", "PG", 100)

    movie.title = "New Title"

    assert movie.title == "New Title"
    assert str(movie) == "New Title (PG) - 100 minutes"


def test_rating_property():
    movie = Movie("Test Movie", "G", 100)

    movie.rating = "PG-13"

    assert movie.rating == "PG-13"


def test_runtime_property():
    movie = Movie("Test Movie", "G", 100)

    movie.runtime = 150

    assert movie.runtime == 150
    assert str(movie) == "Test Movie (G) - 150 minutes"


def test_empty_title():
    with pytest.raises(ValueError):
        Movie("", "PG", 100)


def test_empty_title_property():
    movie = Movie("Test Movie", "PG", 100)

    with pytest.raises(ValueError):
        movie.title = ""


def test_invalid_rating():
    with pytest.raises(ValueError):
        Movie("Test Movie", "PG-14", 100)


def test_invalid_rating_property():
    movie = Movie("Test Movie", "PG", 100)

    with pytest.raises(ValueError):
        movie.rating = "PG-14"


def test_zero_runtime():
    with pytest.raises(ValueError):
        Movie("Test Movie", "PG", 0)


def test_negative_runtime():
    with pytest.raises(ValueError):
        Movie("Test Movie", "PG", -10)


def test_invalid_runtime_property():
    movie = Movie("Test Movie", "PG", 100)

    with pytest.raises(ValueError):
        movie.runtime = 0


def test_runtime_must_be_integer():
    with pytest.raises((ValueError, TypeError)):
        Movie("Test Movie", "PG", 100.5)


def test_valid_runtime_values():
    movie = Movie("Short Film", "G", 1)
    assert movie.runtime == 1

    movie.runtime = 999
    assert movie.runtime == 999
