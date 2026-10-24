import pytest

from mymodule import Song, Playlist


def make_trip():
    trip = Playlist("Road Trip")
    trip.add(Song("Clocks", "Coldplay", 307))
    trip.add(Song("Yellow", "Coldplay", 266))
    trip.add(Song("Africa", "Toto", 139))
    return trip


def test_song_properties():
    song = Song("Clocks", "Coldplay", 307)
    assert song.title == "Clocks"
    assert song.artist == "Coldplay"
    assert song.seconds == 307


def test_song_str():
    assert str(Song("Clocks", "Coldplay", 307)) == "Clocks by Coldplay (5:07)"


def test_song_str_short():
    assert str(Song("Intro", "Band", 45)) == "Intro by Band (0:45)"


def test_song_bad_values():
    with pytest.raises(ValueError):
        Song("", "Coldplay", 307)
    with pytest.raises(ValueError):
        Song("Clocks", "", 307)
    with pytest.raises(ValueError):
        Song("Clocks", "Coldplay", 0)


def test_new_playlist_empty():
    playlist = Playlist("Chill")
    assert playlist.name == "Chill"
    assert len(playlist) == 0
    assert playlist.total_seconds() == 0


def test_add_and_len():
    assert len(make_trip()) == 3


def test_total_seconds():
    assert make_trip().total_seconds() == 712


def test_by_artist():
    assert make_trip().by_artist("Coldplay") == ["Clocks", "Yellow"]


def test_by_artist_none():
    assert make_trip().by_artist("Queen") == []


def test_playlist_str():
    assert str(make_trip()) == "Road Trip (3 songs, 11:52)"


def test_playlist_str_empty():
    assert str(Playlist("Chill")) == "Chill (0 songs, 0:00)"


def test_add_not_a_song():
    with pytest.raises(TypeError):
        Playlist("Bad").add("Clocks")


def test_add_same_song_twice():
    playlist = Playlist("Repeat")
    song = Song("Clocks", "Coldplay", 307)
    playlist.add(song)
    with pytest.raises(ValueError):
        playlist.add(song)
    assert len(playlist) == 1


def test_remove():
    trip = make_trip()
    trip.remove("Yellow")
    assert len(trip) == 2
    assert trip.by_artist("Coldplay") == ["Clocks"]


def test_remove_missing():
    trip = make_trip()
    with pytest.raises(ValueError):
        trip.remove("Bohemian Rhapsody")
    assert len(trip) == 3


def test_playlists_do_not_share_songs():
    a = Playlist("A")
    b = Playlist("B")
    a.add(Song("Clocks", "Coldplay", 307))
    assert len(b) == 0
