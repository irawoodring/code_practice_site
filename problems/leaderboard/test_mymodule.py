import pytest

from mymodule import ranked, top_players, rank_of

SCORES = {"Ada": 92, "Grace": 98, "Linus": 85, "Alan": 98}


def test_ranked_example():
    assert ranked(SCORES) == [("Alan", 98), ("Grace", 98), ("Ada", 92), ("Linus", 85)]


def test_ranked_empty():
    assert ranked({}) == []


def test_ranked_no_ties():
    assert ranked({"Cy": 1, "Bo": 3, "Al": 2}) == [("Bo", 3), ("Al", 2), ("Cy", 1)]


def test_ranked_all_tied():
    assert ranked({"Zoe": 5, "Amy": 5, "Max": 5}) == [("Amy", 5), ("Max", 5), ("Zoe", 5)]


def test_ranked_does_not_change_scores():
    scores = dict(SCORES)
    ranked(scores)
    assert scores == SCORES


def test_top_players():
    assert top_players(SCORES, 2) == ["Alan", "Grace"]


def test_top_players_one():
    assert top_players(SCORES, 1) == ["Alan"]


def test_top_players_too_many():
    assert top_players(SCORES, 10) == ["Alan", "Grace", "Ada", "Linus"]


def test_top_players_zero():
    assert top_players(SCORES, 0) == []


def test_rank_of_first():
    assert rank_of(SCORES, "Alan") == 1


def test_rank_of_tied_second():
    assert rank_of(SCORES, "Grace") == 2


def test_rank_of_middle():
    assert rank_of(SCORES, "Ada") == 3


def test_rank_of_last():
    assert rank_of(SCORES, "Linus") == 4


def test_rank_of_missing():
    with pytest.raises(KeyError):
        rank_of(SCORES, "Nobody")
