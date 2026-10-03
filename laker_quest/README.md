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

The map is 150×160 tiles (about 12 m per tile). The aim is to get the relative positions and orientation right, not exact footprints:

- Lake Michigan Drive (M-45) runs along the **north** edge, and the main entrance turns south onto North Campus Drive.
- The Grand River and its wooded ravines are to the **east**.
- Athletics (Fieldhouse, Kelly Family Sports Center, Lubbers Stadium) are on the **west** side next to the golf course. 48th Avenue and the village of Allendale are farther west.
- Housing is at the north end (Kleiner Commons and the living centers) and the south end (GVA, Copeland, Kirkpatrick, Robinson, Swanson). Academic buildings are in the middle.
- Mary Idema Pew Library sits at Campus Drive and West Campus Drive, next to the Kirkhof Center, near the Cook Carillon and Zumberge Pond.
- The Little Mac Bridge crosses the ravine between Henry Hall and Great Lakes Plaza.

Every building, road, path and landmark is defined in [`src/campus.js`](src/campus.js). To move a building, change its numbers there. Paths to doors, signs and the overview map update automatically.

## Code layout

| File | What's in it |
| --- | --- |
| `src/font.js` | Hand-drawn 5×7 bitmap font |
| `src/engine.js` | Input, sprite helpers, window frames, sound effects |
| `src/sprites.js` | Character template and enemy pixel art |
| `src/campus.js` | Campus layout data |
| `src/world.js` | Tilemap generation, tile, building, tree and furniture rendering |
| `src/data.js` | Stats, items, PSI, enemies, NPC dialogue, interiors |
| `src/battle.js` | Battle system and animated backgrounds |
| `src/game.js` | Game states, overworld, menus, saving, ending |

All art is drawn in code, so there are no image or audio files.
