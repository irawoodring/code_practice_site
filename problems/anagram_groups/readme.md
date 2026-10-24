# Anagram Groups

## The Story

Two words are **anagrams** if you can rearrange the letters of one to spell the other, like `"listen"` and `"silent"`. A word-puzzle magazine wants a tool that finds anagrams in its word lists.

---

## Your Mission

### 1. `is_anagram(a, b)`

Return `True` if `a` and `b` are anagrams of each other, ignoring **capitalization** and **spaces**. A word is **not** an anagram of itself.

```python
is_anagram("listen", "silent")             # True
is_anagram("Dormitory", "dirty room")      # True
is_anagram("hello", "world")               # False
is_anagram("stop", "Stop")                 # False   (same word)
```

### 2. `signature(word)`

Return the word's letters, lowercased and **sorted**, as a string. All anagrams share the same signature.

```python
signature("Listen")   # "eilnst"
signature("silent")   # "eilnst"
```

### 3. `group_anagrams(words)`

Return a **dictionary** mapping each signature to a list of the words that have it, in the order the words appeared.

```python
group_anagrams(["tea", "eat", "tan", "ate", "nat", "bat"])
# {"aet": ["tea", "eat", "ate"], "ant": ["tan", "nat"], "abt": ["bat"]}
```

### 4. `largest_group(words)`

Return the list of words from the **biggest** anagram group. If there's a tie, return the group whose first word appeared earliest. If `words` is empty, return `[]`.

```python
largest_group(["tea", "eat", "tan", "ate", "nat", "bat"])   # ["tea", "eat", "ate"]
```

**Hint:** `sorted("tea")` gives `["a", "e", "t"]`, and `"".join(...)` turns that back into a string. A dictionary whose values are lists is perfect for grouping.
