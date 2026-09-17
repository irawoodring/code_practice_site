import pytest

from mymodule import count_votes


def test_example():
    votes = ['Smith', 'Jones', 'Henry', 'Smith', 'Henry', 'Jones', 'Henry']

    result = count_votes(votes)

    assert result == (
        {'Smith': 2, 'Jones': 2, 'Henry': 3},
        'Henry'
    )


def test_single_vote():
    assert count_votes(['Smith']) == ({'Smith': 1}, 'Smith')


def test_single_candidate_multiple_votes():
    assert count_votes(['Smith', 'Smith', 'Smith', 'Smith']) == (
        {'Smith': 4},
        'Smith'
    )


def test_two_candidates():
    votes = ['Smith', 'Jones', 'Smith', 'Jones', 'Smith']

    assert count_votes(votes) == (
        {'Smith': 3, 'Jones': 2},
        'Smith'
    )


def test_three_candidates():
    votes = [
        'Smith',
        'Jones',
        'Henry',
        'Smith',
        'Henry',
        'Jones',
        'Henry',
        'Smith',
        'Henry'
    ]

    assert count_votes(votes) == (
        {'Smith': 3, 'Jones': 2, 'Henry': 4},
        'Henry'
    )


def test_winner_with_one_vote():
    votes = ['Smith', 'Jones', 'Henry', 'Jones', 'Henry', 'Henry']

    assert count_votes(votes) == (
        {'Smith': 1, 'Jones': 2, 'Henry': 3},
        'Henry'
    )


def test_winner_is_last_candidate_in_list():
    votes = ['Smith', 'Smith', 'Jones', 'Henry', 'Henry', 'Henry']

    assert count_votes(votes) == (
        {'Smith': 2, 'Jones': 1, 'Henry': 3},
        'Henry'
    )


def test_candidate_order_does_not_affect_counts():
    votes1 = ['Smith', 'Jones', 'Henry', 'Smith', 'Henry']
    votes2 = ['Henry', 'Smith', 'Henry', 'Jones', 'Smith']

    counts1, winner1 = count_votes(votes1)
    counts2, winner2 = count_votes(votes2)

    assert counts1 == counts2
    assert winner1 == winner2


def test_many_votes():
    votes = (
        ['Smith'] * 10
        + ['Jones'] * 7
        + ['Henry'] * 12
    )

    assert count_votes(votes) == (
        {'Smith': 10, 'Jones': 7, 'Henry': 12},
        'Henry'
    )


def test_two_candidates_with_different_counts():
    votes = ['Jones', 'Smith', 'Jones', 'Jones']

    assert count_votes(votes) == (
        {'Jones': 3, 'Smith': 1},
        'Jones'
    )
