#!/usr/bin/env python3
import json, re
from pathlib import Path

ROOT = Path("problems")

def is_test(name):
    return bool(re.match(r"^test\.py$|^test_.*\.py$|.*_test\.py$", name, re.I))

problems = []
for folder in sorted(p for p in ROOT.iterdir() if p.is_dir()):
    files = sorted(f.name for f in folder.iterdir() if f.is_file())
    readme = next((f for f in files if f.lower() == "readme.md"), None)
    test = next((f for f in files if is_test(f)), None)
    source = next((f for f in files if f.endswith(".py") and not is_test(f)), None)
    if not (test and source):
        print(f"skipping {folder.name}: needs a source .py and a test .py")
        continue
    # tags.txt lists what the problem practices, one tag per line.
    tags_file = folder / "tags.txt"
    tags = [t.strip() for t in tags_file.read_text().splitlines() if t.strip()] if tags_file.exists() else []
    problems.append({"id": folder.name, "source": source, "test": test, "readme": readme, "tags": tags})

(ROOT / "index.json").write_text(json.dumps(problems, indent=2) + "\n")
print(f"wrote {len(problems)} problems")
