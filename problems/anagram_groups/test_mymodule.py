from mymodule import is_anagram, signature, group_anagrams, largest_group

WORDS = ["tea", "eat", "tan", "ate", "nat", "bat"]


def test_is_anagram_true():
    assert is_anagram("listen", "silent") is True


def test_is_anagram_spaces_and_case():
    assert is_anagram("Dormitory", "dirty room") is True


def test_is_anagram_false():
    assert is_anagram("hello", "world") is False


def test_is_anagram_different_counts():
    assert is_anagram("aab", "abb") is False


def test_is_anagram_same_word():
    assert is_anagram("stop", "Stop") is False


def test_signature():
    assert signature("Listen") == "eilnst"
    assert signature("silent") == "eilnst"


def test_signature_empty():
    assert signature("") == ""


def test_group_anagrams_example():
    assert group_anagrams(WORDS) == {
        "aet": ["tea", "eat", "ate"],
        "ant": ["tan", "nat"],
        "abt": ["bat"],
    }


def test_group_anagrams_empty():
    assert group_anagrams([]) == {}


def test_group_anagrams_case():
    assert group_anagrams(["Stop", "pots", "tops"]) == {"opst": ["Stop", "pots", "tops"]}


def test_largest_group_example():
    assert largest_group(WORDS) == ["tea", "eat", "ate"]


def test_largest_group_tie():
    assert largest_group(["bat", "tab", "cat", "act"]) == ["bat", "tab"]


def test_largest_group_later_bigger():
    assert largest_group(["dog", "god", "rat", "tar", "art"]) == ["rat", "tar", "art"]


def test_largest_group_empty():
    assert largest_group([]) == []
