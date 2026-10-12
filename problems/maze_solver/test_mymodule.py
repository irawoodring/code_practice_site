import pytest

from mymodule import find, shortest_path, reachable


EXAMPLE = [
    "S.#.....",
    ".##.###.",
    "....#...",
    "##.##.#.",
    "......#E",
]


def test_find():
    assert find(EXAMPLE, "S") == (0, 0)
    assert find(EXAMPLE, "E") == (4, 7)


def test_find_first_match():
    assert find(EXAMPLE, "#") == (0, 2)


def test_find_missing():
    with pytest.raises(ValueError):
        find(EXAMPLE, "X")


def test_shortest_path_example():
    assert shortest_path(EXAMPLE) == 15


def test_shortest_path_neighbors():
    assert shortest_path(["SE"]) == 1
    assert shortest_path(["S", "E"]) == 1


def test_shortest_path_straight_line():
    assert shortest_path(["S....E"]) == 5


def test_shortest_path_chooses_shorter_route():
    maze = [
        "S...",
        ".##.",
        ".#E.",
        "....",
    ]

    assert shortest_path(maze) == 6


def test_no_way_out():
    maze = [
        "S.#..",
        "..#.E",
        "###..",
    ]

    assert shortest_path(maze) == -1


def test_exit_walled_off():
    assert shortest_path(["S.#E"]) == -1


def test_start_and_exit_anywhere():
    maze = [
        "....",
        ".#E.",
        ".##.",
        "...S",
    ]

    assert find(maze, "S") == (3, 3)
    assert shortest_path(maze) == 3


def test_big_open_maze_is_fast():
    size = 60
    maze = ["." * size for _ in range(size)]
    maze[0] = "S" + maze[0][1:]
    maze[-1] = maze[-1][:-1] + "E"

    assert shortest_path(maze) == 2 * (size - 1)


def test_reachable_example():
    assert reachable(EXAMPLE) == 27


def test_reachable_walled_in():
    maze = [
        "S.#..",
        "..#.E",
        "###..",
    ]

    assert reachable(maze) == 4


def test_reachable_alone():
    assert reachable(["#S#", "###"]) == 1


def test_reachable_open():
    assert reachable(["S..", "...", "..E"]) == 9
