# Laker Code Gym

Simple site to give students in-browser practice problems.

## Adding Problems

Create a directory for the problem (follow naming convention).  Add a `readme.md` problem description, a `mymodule.py` with any starter code, and a `test_mymodule.py` file of pytest test cases.  Add a `tags.txt` with one tag per line: first `CS1` or `CS2` for the course it suits, then the skills it practices (e.g. `loops`, `dictionaries`).  Reuse existing skill tags where possible; the site groups them under headings listed in `SKILL_GROUPS` in `index.html`, and any new tag shows up under "Other" until you add it there.  Regenerate `index.json` to include newly added problems.
