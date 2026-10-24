# Playlist Classes

This problem practices **composition**: building a class whose objects hold **other objects**. A `Playlist` doesn't inherit from `Song`; it *has* a list of songs.

## Part 1: `Song`

Create a class called `Song` with three properties, each with a getter (no setters needed):

* `title` — a non-empty string
* `artist` — a non-empty string
* `seconds` — the song's length, an integer greater than `0`

Invalid values should raise a `ValueError`.

`__str__` should show the length as minutes and seconds, always with two digits for the seconds:

```python
print(Song("Clocks", "Coldplay", 307))   # Clocks by Coldplay (5:07)
```

## Part 2: `Playlist`

Create a class called `Playlist`. The constructor takes a `name` and starts with **no songs**.

* `name` — a property with a getter
* `add(song)` — add a `Song` to the end of the playlist. If `song` is not a `Song`, raise a `TypeError`. If that exact song is **already** in the playlist, raise a `ValueError`.
* `remove(title)` — remove the first song with that title. If no song has that title, raise a `ValueError`.
* `total_seconds()` — return the total length of every song
* `by_artist(artist)` — return a list of the titles of every song by that artist, in playlist order
* `__len__` — return the number of songs, so `len(playlist)` works
* `__str__` — return the name and the total time:

```text
Road Trip (3 songs, 11:52)
```

### Example

```python
trip = Playlist("Road Trip")
trip.add(Song("Clocks", "Coldplay", 307))
trip.add(Song("Yellow", "Coldplay", 266))
trip.add(Song("Africa", "Toto", 139))

print(len(trip))                 # 3
print(trip.by_artist("Coldplay"))  # ['Clocks', 'Yellow']
print(trip)                      # Road Trip (3 songs, 11:52)
```

**Hint:** `seconds // 60` gives the minutes and `seconds % 60` gives the leftover seconds. `f"{n:02d}"` pads a number to two digits. Both classes need the same minutes-and-seconds formatting, so consider a small helper function.
