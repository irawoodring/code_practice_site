# Unique Visitors

## The Story

The school library keeps a sign-in sheet at the door. Some students sign in more than once a day, so the librarian needs your help making sense of the lists.

Each day's sign-ins are a **list** of names:

```python
monday = ["Ada", "Grace", "Ada", "Linus", "Grace"]
tuesday = ["Linus", "Margaret", "Linus"]
```

---

## Your Mission

### 1. `unique_count(names)`

Return how many **different** people signed in.

```python
unique_count(monday)   # 3
```

### 2. `visited_both(day1, day2)`

Return a **sorted list** of the people who signed in on **both** days.

```python
visited_both(monday, tuesday)   # ["Linus"]
```

### 3. `only_first_day(day1, day2)`

Return a **sorted list** of the people who came on `day1` but **not** on `day2`.

```python
only_first_day(monday, tuesday)   # ["Ada", "Grace"]
```

### 4. `everyone(days)`

`days` is a list of daily sign-in lists. Return a **sorted list** of every person who visited on any day.

```python
everyone([monday, tuesday])   # ["Ada", "Grace", "Linus", "Margaret"]
```

**Hint:** A Python `set` automatically ignores duplicates. Sets also have operators for this kind of question: `a & b` (in both), `a - b` (in `a` but not `b`), and `a | b` (in either). `sorted()` turns a set into a sorted list.
