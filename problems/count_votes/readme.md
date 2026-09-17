# Count Votes

You've been tasked with creating a vote counting system.  The backbone will be a function:

```python
def count_votes(vote_list)
```

The input data will be a list of the format:

```python
['Smith', 'Jones', 'Henry', 'Smith', 'Henry', 'Jones', 'Henry']
```

Your function should return two things - a dictionary of vote count totals, and the name of the winner.  For the above example, it would look like

```python
({'Smith':2, 'Jones':2, 'Henry': 3}, 'Henry')
```

You can return more than one thing in Python by returning a tuple.  For instance, if your dictionary was named `vote_counts` and the string with the winner's name was `winner_name`, you could write

```python
return (vote_counts, winner_name)
```

Your function will be tested on a variety of input lists, so be sure your function works regardless of the number of votes and number of candidates.
