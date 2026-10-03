import pytest

from mymodule import play_round, play_match, match_winner


def test_player1_wins():
    assert play_round("rock", "scissors") == 1
    assert play_round("scissors", "paper") == 1
    assert play_round("paper", "rock") == 1


def test_player2_wins():
    assert play_round("scissors", "rock") == 2
    assert play_round("paper", "scissors") == 2
    assert play_round("rock", "paper") == 2


def test_ties():
    for move in ["rock", "paper", "scissors"]:
        assert play_round(move, move) == 0


def test_capitalization():
    assert play_round("Paper", "scissors") == 2
    assert play_round("rock", "ROCK") == 0


def test_invalid_move():
    with pytest.raises(ValueError):
        play_round("lizard", "rock")

    with pytest.raises(ValueError):
        play_round("rock", "spock")


def test_play_match_example():
    moves1 = ["rock", "paper", "rock"]
    moves2 = ["scissors", "scissors", "rock"]

    assert play_match(moves1, moves2) == (1, 1, 1)


def test_play_match_sweep():
    assert play_match(["paper"] * 4, ["rock"] * 4) == (4, 0, 0)


def test_play_match_empty():
    assert play_match([], []) == (0, 0, 0)


def test_play_match_different_lengths():
    with pytest.raises(ValueError):
        play_match(["rock", "paper"], ["rock"])


def test_match_winner_tie():
    assert match_winner(["rock", "rock"], ["scissors", "paper"]) == "Tie"


def test_match_winner_player1():
    assert match_winner(["paper", "paper"], ["rock", "paper"]) == "Player 1"


def test_match_winner_player2():
    moves1 = ["rock", "rock", "scissors"]
    moves2 = ["paper", "rock", "rock"]

    assert match_winner(moves1, moves2) == "Player 2"


def test_match_winner_all_ties():
    assert match_winner(["rock", "paper"], ["rock", "paper"]) == "Tie"
