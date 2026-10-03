# Laker Quest

An Earthbound-style 2D RPG set on Grand Valley State University's Allendale campus.

At midnight the Cook Carillon rang thirteen times, out of tune, and since then campus has been strange. Squirrels pick fights, overdue books fly around the library, and the geese are worse than usual. Find out what's going on in the tower.

## Running it

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```sh
cd laker_quest
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Controls

| Key | Action |
| --- | --- |
| Arrow keys / WASD | Walk |
| Shift | Run |
| Z / Enter / Space | Talk, check, confirm |
| X / Esc | Menu, back |
| M | Campus map |

Save by checking a phone (in Kirkhof, Zumberge, the Fieldhouse, your dorm, and a few other places) and calling home.

## Earthbound mechanics

- **Rolling HP meter.** Damage drains your HP meter gradually instead of all at once. If you take mortal damage, you can still survive by winning before the meter reaches zero.
- **Psychedelic battle backgrounds.** Each enemy has its own palette-cycling background with scanline distortion.
- **Visible enemies.** Enemies wander the map and chase you on sight. If you touch one from behind, you get a free turn; if it catches you from behind, it gets one.
- **Instant wins.** Once you're far stronger than an enemy, it runs from you, and catching it wins the fight instantly.
- **SMAAAASH!!** Bash attacks can land critical hits.
- **PSI.** You learn PSI as you level up: Lifeup, PSI Laker, and Shield.

## The campus

The campus is traced from GVSU's official Allendale campus map, the version with the A–F / 1–9 grid. `tools/trace_map.py` classifies the map by color into buildings, roads, sidewalks, parking lots (in their permit colors), fields and water. It then turns every 2×2 block of map pixels into one game tile and names each building from the map's labels. The output is `src/campus_map.js`, 214×284 tiles with 154 buildings.

That means building shapes, roads, lots and their positions relative to each other match the map. A few things were added by hand where the map is blank or only schematic:

- The creek ravine and the Little Mac Bridge across it to the Arboretum
- The Meadows golf course, farmland south of Pierce St, and the woods and Grand River east of campus (off the edge of the map)
- The Cook Carillon Tower, which the map shows as a tiny square

Signs, NPCs and enemy areas in `src/campus.js` and `src/data.js` are placed in map-image pixel coordinates, so any spot can be checked against the map.

To regenerate the map (needs Pillow, numpy and scipy):

```sh
python3 tools/trace_map.py path/to/allendale_campus_map.jpg --preview preview.png
```

The map image itself isn't included in the repo.

## Code layout

| File | What's in it |
| --- | --- |
| `src/font.js` | Hand-drawn 5×7 bitmap font |
| `src/engine.js` | Input, sprite helpers, window frames, sound effects |
| `src/sprites.js` | Character template and enemy pixel art |
| `src/campus_map.js` | Generated tile map and building shapes (from `tools/trace_map.py`) |
| `src/campus.js` | Signs, interiors and map labels, placed in campus map coordinates |
| `src/world.js` | Builds the playable map; draws tiles, buildings of any shape, trees and furniture |
| `src/data.js` | Stats, items, PSI, enemies, NPC dialogue, interiors |
| `src/battle.js` | Battle system and animated backgrounds |
| `src/game.js` | Game states, overworld, menus, saving, ending |

All art is drawn in code, so there are no image or audio files.
