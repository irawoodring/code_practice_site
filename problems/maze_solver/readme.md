# Maze Solver

A robot is trapped in a maze and needs to find the **shortest** way out. The maze is a list of strings, where each character is one square:

* `S` — the start
* `E` — the exit
* `#` — a wall
* `.` — an open floor square

```python
maze = [
    "S.#.....",
    ".##.###.",
    "....#...",
    "##.##.#.",
    "......#E",
]
```

The robot can move **up, down, left, or right** one square at a time (not diagonally), and can't walk through walls or off the edge of the maze.

## Your Mission

### 1. `find(maze, ch)`

Return the `(row, col)` position of the first square containing `ch`, scanning row by row from the top. If `ch` doesn't appear anywhere, raise a `ValueError`.

```python
find(maze, "S")   # (0, 0)
find(maze, "E")   # (4, 7)
```

### 2. `shortest_path(maze)`

Return the **smallest number of moves** to get from `S` to `E`, or `-1` if there's no way out. The example maze above takes `15` moves.

### 3. `reachable(maze)`

Return how many squares the robot could ever reach from `S`, counting `S` itself, plus `E` if it can be reached.

## How to Find the Shortest Path

Use **breadth-first search** (BFS). It explores the maze in "rings": first every square 1 move away, then every square 2 moves away, and so on. The first time BFS reaches `E`, it has found the shortest path.

1. Put the start square in a **queue**, recorded as 0 moves away, and mark it as visited.
2. While the queue isn't empty, dequeue a square. For each of its 4 neighbors that is inside the maze, not a wall, and not yet visited: mark it as visited and enqueue it with a distance one bigger.

**Hint:** `collections.deque` makes a fast queue with `append()` and `popleft()`. A `set` of `(row, col)` tuples is a good way to remember visited squares. `reachable` is almost the same search!
