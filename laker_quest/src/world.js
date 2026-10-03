// Turns map data (campus or an interior) into tiles, collision, drawable
// objects and a pre-rendered ground layer.
window.LQ = window.LQ || {};

const T = LQ.T = {
  GRASS: 0, PATH: 1, BRICK: 2, ROAD: 3, ROAD_LINE_H: 4, ROAD_LINE_V: 5,
  WATER: 6, TREE: 7, RAVINE: 8, BRIDGE: 9, TURF: 10, FAIRWAY: 11, SAND: 12,
  FARM: 13, PARKING: 14, FLOWERS: 15, BUILDING: 16, DOOR: 17, STANDS: 18,
  DIRT: 19, FLOOR_WOOD: 20, FLOOR_TILE: 21, FLOOR_CARPET: 22, WALL: 23,
  FURN: 24, EXIT: 25, VOID: 26,
};

LQ.SOLID = new Set([T.WATER, T.TREE, T.RAVINE, T.BUILDING, T.STANDS, T.WALL, T.FURN, T.VOID]);

// ------------------------------------------------------------ map object
LQ.GameMap = class {
  constructor(id, w, h, fill) {
    this.id = id;
    this.w = w;
    this.h = h;
    this.tiles = new Uint8Array(w * h).fill(fill);
    this.solidOverride = new Map();   // idx -> bool (doors, furniture)
    this.objects = [];                // y-sorted static drawables
    this.doors = [];                  // {x, y, building, interior}
    this.signs = [];                  // {x, y, text}
    this.exits = [];                  // interior exits {x, y}
    this.treeRows = [];               // trees bucketed by row for culling
    this.ground = null;
  }
  inside(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  get(x, y) { return this.inside(x, y) ? this.tiles[y * this.w + x] : T.VOID; }
  set(x, y, t) { if (this.inside(x, y)) this.tiles[y * this.w + x] = t; }
  fill(r, t, onlyIf) {
    for (let y = r.y; y < r.y + r.h; y++)
      for (let x = r.x; x < r.x + r.w; x++)
        if (!onlyIf || onlyIf(this.get(x, y), x, y)) this.set(x, y, t);
  }
  isSolid(x, y) {
    if (!this.inside(x, y)) return true;
    const i = y * this.w + x;
    if (this.solidOverride.has(i)) return this.solidOverride.get(i);
    return LQ.SOLID.has(this.tiles[i]);
  }
  // Pixel-space box collision against the tile grid.
  boxBlocked(px, py, w, h) {
    const x0 = Math.floor(px / 16), x1 = Math.floor((px + w - 1) / 16);
    const y0 = Math.floor(py / 16), y1 = Math.floor((py + h - 1) / 16);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++)
        if (this.isSolid(x, y)) return true;
    return false;
  }
  buildingAt(x, y) {
    return this.buildings ? this.buildings.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) : null;
  }
};

// ------------------------------------------------------------ campus build
LQ.buildCampus = function () {
  const C = LQ.CAMPUS;
  const m = new LQ.GameMap('campus', C.width, C.height, T.GRASS);
  m.name = 'GVSU Allendale';
  m.buildings = C.buildings;
  const inRect = (r, x, y) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;

  // Fields and farmland first; everything else paints over them.
  for (const f of C.fields) {
    const t = f.kind === 'turf' ? T.TURF : f.kind === 'fairway' ? T.FAIRWAY : T.FARM;
    m.fill(f, t);
  }
  // A few sand traps on the golf course.
  [[27, 22], [30, 40], [26, 58], [29, 70]].forEach(([x, y]) => m.fill({ x, y, w: 3, h: 2 }, T.SAND));

  // River with a gentle wobble.
  for (let y = 0; y < C.height; y++) {
    const wob = Math.round(Math.sin(y / 9) * 1.5 + Math.sin(y / 23) * 1.2);
    for (let x = C.river.x + wob; x < C.river.x + wob + C.river.w; x++) m.set(x, y, T.WATER);
  }

  // Ravines (impassable steep woods) with ragged edges.
  for (const r of C.ravines) {
    for (let y = r.y; y < r.y + r.h; y++) {
      for (let x = r.x; x < r.x + r.w; x++) {
        if (m.get(x, y) === T.WATER) continue;
        const edge = (y === r.y || y === r.y + r.h - 1) && LQ.hash(x, y, 7) < 0.4;
        if (r.sparse) {
          if (LQ.hash(x, y, 11) < 0.33) m.set(x, y, T.RAVINE);
        } else if (!edge) {
          m.set(x, y, T.RAVINE);
        }
      }
    }
  }

  // Pond (ellipse).
  const p = C.pond;
  for (let y = p.cy - p.ry; y <= p.cy + p.ry; y++)
    for (let x = p.cx - p.rx; x <= p.cx + p.rx; x++) {
      const d = ((x - p.cx) / p.rx) ** 2 + ((y - p.cy) / p.ry) ** 2;
      if (d < 1) m.set(x, y, T.WATER);
    }

  for (const pl of C.plazas) m.fill(pl, T.BRICK, (t) => t === T.GRASS);
  for (const pk of C.parking) m.fill(pk, T.PARKING);

  // Roads. Count overlaps so intersections don't get center lines.
  const roadCount = new Uint8Array(m.w * m.h);
  for (const r of C.roads) {
    const horiz = r.w > r.h;
    for (let y = r.y; y < r.y + r.h; y++)
      for (let x = r.x; x < r.x + r.w; x++) {
        if (!m.inside(x, y)) continue;
        const i = y * m.w + x;
        roadCount[i]++;
        let t = T.ROAD;
        if (horiz && y === r.y + Math.floor(r.h / 2) - 1) t = T.ROAD_LINE_H;
        if (!horiz && x === r.x + Math.floor(r.w / 2) - 1) t = T.ROAD_LINE_V;
        m.tiles[i] = roadCount[i] > 1 ? T.ROAD : t;
      }
  }

  // Sidewalks along roads wherever there's grass.
  for (let y = 0; y < m.h; y++)
    for (let x = 0; x < m.w; x++) {
      if (m.get(x, y) !== T.GRASS) continue;
      const nearRoad = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
        const t = m.get(x + dx, y + dy);
        return t === T.ROAD || t === T.ROAD_LINE_H || t === T.ROAD_LINE_V;
      });
      if (nearRoad && !inRect({ x: 0, y: 140, w: 150, h: 20 }, x, y)) m.set(x, y, T.PATH);
    }

  for (const pa of C.paths)
    m.fill(pa, pa.dirt ? T.DIRT : T.PATH, (t) => t !== T.WATER);
  for (const b of C.bridges) m.fill(b, T.BRIDGE);

  // Stadium stands.
  for (const s of C.stadiumStands) m.fill(s, T.STANDS);

  // Buildings: footprint + door + a path from the door to the nearest walkway.
  for (const b of C.buildings) {
    m.fill(b, T.BUILDING);
    const dx = b.x + (b.door !== undefined ? b.door : Math.floor(b.w / 2));
    const dy = b.y + b.h - 1;
    m.set(dx, dy, T.DOOR);
    m.solidOverride.set(dy * m.w + dx, !b.interior);
    m.doors.push({ x: dx, y: dy, building: b, interior: b.interior });
    for (let y = dy + 1; y < dy + 14; y++) {
      const t = m.get(dx, y);
      if (t !== T.GRASS && t !== T.FLOWERS && t !== T.FARM) break;
      m.set(dx, y, T.PATH);
    }
    // Flower beds flanking the door.
    [dx - 2, dx + 2].forEach((fx) => { if (m.get(fx, dy + 1) === T.GRASS) m.set(fx, dy + 1, T.FLOWERS); });
    m.objects.push({ kind: 'building', b, sortY: (b.y + b.h) * 16, sprite: LQ.renderBuilding(b) });
  }

  // Carillon tower.
  const ca = C.carillon;
  m.fill(ca, T.BUILDING);
  m.carillon = ca;
  m.objects.push({ kind: 'carillon', sortY: (ca.y + ca.h) * 16, sprite: LQ.renderCarillon(), x: ca.x * 16, y: (ca.y + ca.h) * 16 });

  // Signs.
  for (const s of C.signs) {
    m.set(s.x, s.y, m.get(s.x, s.y) === T.TREE ? T.GRASS : m.get(s.x, s.y));
    m.solidOverride.set(s.y * m.w + s.x, true);
    m.signs.push(s);
    m.objects.push({ kind: 'sign', sortY: (s.y + 1) * 16, x: s.x * 16, y: s.y * 16 + 6, sprite: LQ.signSprite || (LQ.signSprite = LQ.makeSignSprite()) });
  }

  // Trees: dense in woods, sparse elsewhere, never crowding walkways.
  const signAt = new Set(C.signs.map((s) => s.y * m.w + s.x));
  for (let y = 0; y < m.h; y++) {
    m.treeRows[y] = [];
    for (let x = 0; x < m.w; x++) {
      if (m.get(x, y) !== T.GRASS || signAt.has(y * m.w + x)) continue;
      const crowded = [[1, 0], [-1, 0], [0, 1], [0, -1], [0, -2]].some(([ddx, ddy]) => {
        const t = m.get(x + ddx, y + ddy);
        return t !== T.GRASS && t !== T.TREE && t !== T.RAVINE && t !== T.WATER && t !== T.FARM;
      });
      const inWoods = C.woods.some((w) => inRect(w, x, y));
      const nearRavine = C.ravines.some((r) => inRect({ x: r.x - 2, y: r.y - 2, w: r.w + 4, h: r.h + 4 }, x, y));
      let pTree = 0.028;
      if (inWoods) pTree = 0.5;
      else if (nearRavine) pTree = 0.3;
      if (crowded && !inWoods) continue;
      if (LQ.hash(x, y, 3) < pTree && (x + y) % 2 === 0) {
        m.set(x, y, T.TREE);
        m.treeRows[y].push({ x, y, v: Math.floor(LQ.hash(x, y, 5) * 3) });
      } else if (!inWoods && LQ.hash(x, y, 9) < 0.012) {
        m.set(x, y, T.FLOWERS);
      }
    }
  }

  m.ground = LQ.renderGround(m);
  return m;
};

// ------------------------------------------------------------ interiors
LQ.buildInterior = function (def) {
  const m = new LQ.GameMap(def.id, def.w, def.h, T.WALL);
  m.name = def.name;
  m.def = def;
  const floor = def.floor === 'tile' ? T.FLOOR_TILE : def.floor === 'carpet' ? T.FLOOR_CARPET : T.FLOOR_WOOD;
  m.fill({ x: 1, y: 2, w: def.w - 2, h: def.h - 3 }, floor);
  const ex = Math.floor(def.w / 2) - 1;
  for (const x of [ex, ex + 1]) {
    m.set(x, def.h - 1, T.EXIT);
    m.exits.push({ x, y: def.h - 1 });
  }
  for (const f of def.furniture || []) {
    m.fill(f, T.FURN);
    m.objects.push({ kind: 'furn', f, sortY: (f.y + f.h) * 16, sprite: LQ.renderFurniture(f) });
  }
  m.ground = LQ.renderGround(m);
  return m;
};

// ------------------------------------------------------------ tile art
LQ.TILE_COLORS = {
  grass: ['#88d070', '#78c060', '#98d880'],
  path: '#d8d4c4',
  pathSeam: '#b8b4a8',
  brick: '#c87860',
  brickSeam: '#a05848',
  road: '#686874',
  roadSpeck: '#5a5a66',
  line: '#f0d050',
  water: '#4898e8',
  waterLight: '#88c8f8',
  ravine: '#3a7038',
  ravineDark: '#285028',
  bridge: '#a87850',
  bridgeDark: '#785030',
  turf: ['#50a848', '#5cb854'],
  fairway: ['#7cd068', '#88dc74'],
  sand: '#f0e0a0',
  farm: ['#a07848', '#886038'],
  parking: '#78787f',
  dirt: '#c8a070',
  stands: '#9898a8',
};

LQ.drawTile = function (cx, t, x, y, px, py, m) {
  const C = LQ.TILE_COLORS;
  const h = (s) => LQ.hash(x, y, s);
  const dots = (col, n, seed) => {
    cx.fillStyle = col;
    for (let i = 0; i < n; i++) cx.fillRect(px + Math.floor(LQ.hash(x * 7 + i, y, seed) * 15), py + Math.floor(LQ.hash(x, y * 7 + i, seed) * 15), 1, 1);
  };
  switch (t) {
    case T.GRASS: case T.TREE: case T.FLOWERS: {
      cx.fillStyle = C.grass[0];
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = C.grass[1];
      for (let i = 0; i < 4; i++) {
        const gx = px + Math.floor(LQ.hash(x * 5 + i, y, 1) * 14), gy = py + Math.floor(LQ.hash(x, y * 5 + i, 2) * 14);
        cx.fillRect(gx, gy, 1, 2);
        cx.fillRect(gx + 2, gy + 1, 1, 2);
      }
      dots(C.grass[2], 3, 4);
      if (t === T.FLOWERS) {
        const cols = ['#f87898', '#f8f070', '#f8f8f8', '#b088f8'];
        for (let i = 0; i < 4; i++) {
          cx.fillStyle = cols[Math.floor(h(20 + i) * 4)];
          const fx = px + 2 + Math.floor(h(30 + i) * 11), fy = py + 2 + Math.floor(h(40 + i) * 11);
          cx.fillRect(fx, fy, 2, 2);
        }
      }
      break;
    }
    case T.PATH: case T.DOOR: {
      cx.fillStyle = C.path;
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = C.pathSeam;
      if (x % 2 === 0) cx.fillRect(px, py, 1, 16);
      if (y % 2 === 0) cx.fillRect(px, py, 16, 1);
      dots('#c8c4b8', 2, 6);
      break;
    }
    case T.BRICK: {
      cx.fillStyle = C.brick;
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = C.brickSeam;
      for (let r = 0; r < 4; r++) {
        cx.fillRect(px, py + r * 4, 16, 1);
        const off = (r + y) % 2 ? 0 : 4;
        cx.fillRect(px + off, py + r * 4, 1, 4);
        cx.fillRect(px + off + 8, py + r * 4, 1, 4);
      }
      break;
    }
    case T.ROAD: case T.ROAD_LINE_H: case T.ROAD_LINE_V: {
      cx.fillStyle = C.road;
      cx.fillRect(px, py, 16, 16);
      dots(C.roadSpeck, 6, 8);
      cx.fillStyle = C.line;
      if (t === T.ROAD_LINE_H && x % 2 === 0) cx.fillRect(px + 2, py + 15, 12, 2);
      if (t === T.ROAD_LINE_V && y % 2 === 0) cx.fillRect(px + 15, py + 2, 2, 12);
      break;
    }
    case T.WATER: {
      cx.fillStyle = C.water;
      cx.fillRect(px, py, 16, 16);
      // Shore lip where water meets land.
      cx.fillStyle = '#f0e8c0';
      if (m.get(x, y - 1) !== T.WATER && m.get(x, y - 1) !== T.VOID) cx.fillRect(px, py, 16, 2);
      if (m.get(x - 1, y) !== T.WATER && m.get(x - 1, y) !== T.VOID) cx.fillRect(px, py, 2, 16);
      if (m.get(x + 1, y) !== T.WATER && m.get(x + 1, y) !== T.VOID) cx.fillRect(px + 14, py, 2, 16);
      cx.fillStyle = '#3070c0';
      if (m.get(x, y + 1) !== T.WATER && m.get(x, y + 1) !== T.VOID) cx.fillRect(px, py + 14, 16, 2);
      break;
    }
    case T.RAVINE: {
      cx.fillStyle = C.ravineDark;
      cx.fillRect(px, py, 16, 16);
      // Bumpy tree-top canopy seen from above.
      for (let i = 0; i < 3; i++) {
        cx.fillStyle = i % 2 ? C.ravine : '#4a8a44';
        const bx = px + Math.floor(h(50 + i) * 10), by = py + Math.floor(h(60 + i) * 10);
        cx.fillRect(bx, by + 1, 7, 5);
        cx.fillRect(bx + 1, by, 5, 7);
      }
      break;
    }
    case T.BRIDGE: {
      cx.fillStyle = C.bridge;
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = C.bridgeDark;
      for (let r = 0; r < 16; r += 4) cx.fillRect(px, py + r, 16, 1);
      // Railings with safety fencing.
      const left = m.get(x - 1, y) !== T.BRIDGE, right = m.get(x + 1, y) !== T.BRIDGE;
      cx.fillStyle = '#505060';
      if (left) { cx.fillRect(px, py, 3, 16); cx.fillStyle = '#9898a8'; cx.fillRect(px + 1, py, 1, 16); cx.fillStyle = '#505060'; }
      if (right) { cx.fillRect(px + 13, py, 3, 16); cx.fillStyle = '#9898a8'; cx.fillRect(px + 14, py, 1, 16); }
      break;
    }
    case T.TURF: {
      cx.fillStyle = C.turf[y % 2];
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = '#f8f8f8';
      if (y % 4 === 0) cx.fillRect(px, py, 16, 1);
      break;
    }
    case T.FAIRWAY: {
      cx.fillStyle = C.fairway[(x + y) % 2];
      cx.fillRect(px, py, 16, 16);
      break;
    }
    case T.SAND: {
      cx.fillStyle = C.sand;
      cx.fillRect(px, py, 16, 16);
      dots('#d8c888', 6, 12);
      break;
    }
    case T.FARM: {
      cx.fillStyle = C.farm[0];
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = C.farm[1];
      for (let r = 0; r < 16; r += 4) cx.fillRect(px, py + r, 16, 2);
      cx.fillStyle = '#7ab048';
      for (let i = 0; i < 16; i += 4) cx.fillRect(px + i + 1, py + 2 + (x % 2) * 4, 2, 2);
      break;
    }
    case T.PARKING: {
      cx.fillStyle = C.parking;
      cx.fillRect(px, py, 16, 16);
      dots(C.roadSpeck, 4, 13);
      cx.fillStyle = '#e8e8e8';
      if (x % 2 === 0 && y % 4 !== 3) cx.fillRect(px, py, 1, 16);
      break;
    }
    case T.DIRT: {
      cx.fillStyle = C.dirt;
      cx.fillRect(px, py, 16, 16);
      dots('#a88050', 5, 14);
      break;
    }
    case T.STANDS: {
      cx.fillStyle = C.stands;
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = '#707080';
      for (let r = 0; r < 16; r += 4) cx.fillRect(px, py + r, 16, 1);
      cx.fillStyle = '#0032a0';
      for (let r = 2; r < 16; r += 4) cx.fillRect(px + 2, py + r, 12, 1);
      break;
    }
    case T.FLOOR_WOOD: {
      cx.fillStyle = '#d8a868';
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = '#b88848';
      for (let r = 0; r < 16; r += 4) cx.fillRect(px, py + r, 16, 1);
      cx.fillRect(px + ((y * 5) % 16), py, 1, 16);
      break;
    }
    case T.FLOOR_TILE: {
      cx.fillStyle = (x + y) % 2 ? '#e8e8f0' : '#c8d0e0';
      cx.fillRect(px, py, 16, 16);
      break;
    }
    case T.FLOOR_CARPET: {
      cx.fillStyle = '#4868b0';
      cx.fillRect(px, py, 16, 16);
      dots('#5878c0', 10, 15);
      break;
    }
    case T.WALL: {
      const below = m.get(x, y + 1);
      const isFace = below !== T.WALL && below !== T.VOID && y < m.h - 1;
      cx.fillStyle = isFace ? '#f0e8d8' : '#504858';
      cx.fillRect(px, py, 16, 16);
      if (isFace) {
        cx.fillStyle = '#d8ccb8';
        cx.fillRect(px, py + 13, 16, 3);
        cx.fillStyle = '#0032a0';
        cx.fillRect(px, py + 4, 16, 2);
      }
      break;
    }
    case T.EXIT: {
      cx.fillStyle = '#a04040';
      cx.fillRect(px, py, 16, 16);
      cx.fillStyle = '#c86060';
      cx.fillRect(px + 2, py + 2, 12, 10);
      break;
    }
    case T.BUILDING: case T.FURN: {
      cx.fillStyle = m.id === 'campus' ? C.grass[0] : '#d8a868';
      cx.fillRect(px, py, 16, 16);
      break;
    }
    default:
      cx.fillStyle = '#000';
      cx.fillRect(px, py, 16, 16);
  }
};

LQ.renderGround = function (m) {
  const c = document.createElement('canvas');
  c.width = m.w * 16;
  c.height = m.h * 16;
  const cx = c.getContext('2d');
  for (let y = 0; y < m.h; y++)
    for (let x = 0; x < m.w; x++) LQ.drawTile(cx, m.get(x, y), x, y, x * 16, y * 16, m);
  return c;
};

// ------------------------------------------------------------ trees
LQ.treeSprites = null;
LQ.getTreeSprites = function () {
  if (LQ.treeSprites) return LQ.treeSprites;
  const greens = [['#2f7a3a', '#48a050', '#70c070'], ['#2a6a48', '#3e9060', '#68b880'], ['#4a7a2a', '#68a038', '#90c858']];
  LQ.treeSprites = greens.map(([d, m, l]) => LQ.makeSprite([
    '.....kkkkkk.....',
    '...kkmmmmmmkk...',
    '..kmmmllmmmmmk..',
    '.kmmllllmmmmmdk.',
    '.kmmlllmmmmmmdk.',
    'kmmmllmmmmmmmddk',
    'kmmmmmmmmmmmmddk',
    'kmmmmmmmmmmmdddk',
    'kdmmmmmmmmmmdddk',
    '.kdmmmmmmmmdddk.',
    '.kddmmmmmddddkk.',
    '..kkdddddddkk...',
    '....kkkbbkkk....',
    '......kbbk......',
    '......kbbk......',
    '.....kbbbbk.....',
    '......kkkk......',
  ], { k: '#183018', d, m, l, b: '#7a5030' }));
  return LQ.treeSprites;
};

// ------------------------------------------------------------ buildings
LQ.BUILDING_STYLES = {
  brick: { wall: '#b86048', wall2: '#a04c38', roof: '#707888', roof2: '#5a6070', win: '#a8d8f8', trim: '#e8dcc8' },
  stone: { wall: '#e0d0b0', wall2: '#c8b898', roof: '#9a5040', roof2: '#7a3c30', win: '#88c0e8', trim: '#f8f0e0' },
  glass: { wall: '#90c8f0', wall2: '#70a8d8', roof: '#d8d8e0', roof2: '#b8b8c8', win: '#c8e8ff', trim: '#f8f8f8', glassy: true },
  modern: { wall: '#d0d0d8', wall2: '#b0b0c0', roof: '#7a7a88', roof2: '#62626e', win: '#a8d8f8', trim: '#0032a0', band: true },
  house: { wall: '#f0d890', wall2: '#d8c070', roof: '#c05040', roof2: '#983828', win: '#a8d8f8', trim: '#f8f8f8', house: true },
  shop: { wall: '#f0e0c0', wall2: '#d8c8a8', roof: '#606878', roof2: '#4a5060', win: '#a8d8f8', trim: '#e04848', awning: true },
};
LQ.BUILDING_RISE = 14;   // pixels the roof rises above the footprint (oblique view)

LQ.renderBuilding = function (b) {
  const S = Object.assign({}, LQ.BUILDING_STYLES[b.style] || LQ.BUILDING_STYLES.brick);
  if (S.house) {
    const walls = ['#f0d890', '#a8d8a8', '#f0b8a8', '#b8c8f0'];
    S.wall = walls[Math.floor(LQ.hash(b.x, b.y, 1) * walls.length)];
  }
  const W = b.w * 16, R = LQ.BUILDING_RISE;
  const H = b.h * 16 + R;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const cx = c.getContext('2d');
  const facadeRows = LQ.clamp(Math.ceil(b.h / 2), 2, 4);
  const faceTop = H - facadeRows * 16;
  if (b.style === 'brick' || b.style === 'stone') {
    // Vary roof colors so neighboring buildings read as separate places.
    const roofs = [['#707888', '#5a6070'], ['#9a5040', '#7a3c30'], ['#5a8068', '#46644f'], ['#6a6a9a', '#54547c']];
    const r = roofs[Math.floor(LQ.hash(b.x, b.y, 8) * roofs.length)];
    S.roof = r[0];
    S.roof2 = r[1];
  }

  // Roof (seen from above).
  cx.fillStyle = '#181820';
  cx.fillRect(0, 0, W, faceTop + 1);
  cx.fillStyle = S.roof;
  cx.fillRect(1, 1, W - 2, faceTop - 1);
  cx.fillStyle = S.roof2;
  cx.fillRect(1, faceTop - 4, W - 2, 3);
  if (S.house) {
    // Gabled roof: ridge line + shingle rows.
    cx.fillStyle = S.roof2;
    cx.fillRect(1, Math.floor(faceTop / 2), W - 2, 1);
    for (let y = 4; y < faceTop - 4; y += 4) for (let x = (y % 8) ? 2 : 6; x < W - 2; x += 8) cx.fillRect(x, y, 1, 3);
  } else {
    // Rooftop seams, units and a parapet.
    cx.fillStyle = S.roof2;
    cx.fillRect(3, 3, W - 6, 1);
    for (let y = 8; y < faceTop - 6; y += 6) cx.fillRect(4, y, W - 8, 1);
    const units = Math.max(1, Math.floor(b.w / 4));
    for (let i = 0; i < units; i++) {
      const ux = 6 + Math.floor(LQ.hash(b.x + i, b.y, 2) * (W - 20));
      const uy = 6 + Math.floor(LQ.hash(b.x, b.y + i, 3) * Math.max(1, faceTop - 22));
      cx.fillStyle = '#181820';
      cx.fillRect(ux - 1, uy - 1, 12, 9);
      cx.fillStyle = '#c0c0c8';
      cx.fillRect(ux, uy, 10, 7);
      cx.fillStyle = '#9090a0';
      cx.fillRect(ux + 2, uy + 2, 6, 3);
    }
    if (S.glassy) {
      cx.fillStyle = '#a8d8f8';
      cx.fillRect(8, 8, W - 16, Math.max(4, faceTop - 20));
      cx.fillStyle = '#d8f0ff';
      for (let x = 10; x < W - 10; x += 8) cx.fillRect(x, 8, 1, Math.max(4, faceTop - 20));
    }
  }

  // Facade.
  cx.fillStyle = '#181820';
  cx.fillRect(0, faceTop, W, H - faceTop);
  cx.fillStyle = S.wall;
  cx.fillRect(1, faceTop + 1, W - 2, H - faceTop - 2);
  if (b.style === 'brick') {
    cx.fillStyle = S.wall2;
    for (let y = faceTop + 3; y < H - 1; y += 3) for (let x = ((y / 3) % 2) * 3 + 1; x < W - 1; x += 6) cx.fillRect(x, y, 4, 1);
  }
  cx.fillStyle = S.trim;
  cx.fillRect(1, faceTop + 1, W - 2, 2);
  if (S.band) { cx.fillStyle = '#0032a0'; cx.fillRect(1, faceTop + 4, W - 2, 3); }
  if (S.awning) {
    for (let x = 1; x < W - 1; x += 4) { cx.fillStyle = (x / 4) % 2 ? '#f8f8f8' : '#e04848'; cx.fillRect(x, faceTop + 3, 4, 5); }
  }

  // Windows.
  const doorCol = b.door !== undefined ? b.door : Math.floor(b.w / 2);
  const rows = [];
  for (let r = 0; r < facadeRows; r++) rows.push(faceTop + 10 + r * 16);
  for (const wy of rows) {
    for (let col = 0; col < b.w; col++) {
      if (col === doorCol && wy > H - 30) continue;
      const wx = col * 16 + 4;
      if (S.glassy) {
        cx.fillStyle = '#304860';
        cx.fillRect(wx - 3, wy - 1, 16, 12);
        cx.fillStyle = S.win;
        cx.fillRect(wx - 2, wy, 14, 10);
        cx.fillStyle = '#f8ffff';
        cx.fillRect(wx - 1, wy + 1, 2, 4);
      } else {
        cx.fillStyle = '#283040';
        cx.fillRect(wx - 1, wy - 1, 10, 11);
        cx.fillStyle = S.win;
        cx.fillRect(wx, wy, 8, 9);
        cx.fillStyle = '#f8ffff';
        cx.fillRect(wx + 1, wy + 1, 2, 3);
        cx.fillStyle = '#283040';
        cx.fillRect(wx, wy + 4, 8, 1);
      }
    }
  }

  // Door.
  const dx = doorCol * 16 + 2;
  cx.fillStyle = '#181820';
  cx.fillRect(dx - 1, H - 21, 14, 21);
  cx.fillStyle = b.interior ? '#5a3a28' : '#584848';
  cx.fillRect(dx, H - 20, 12, 20);
  cx.fillStyle = b.interior ? '#a8d8f8' : '#7a6a6a';
  cx.fillRect(dx + 2, H - 18, 8, 7);
  cx.fillStyle = '#f8d040';
  cx.fillRect(dx + 9, H - 9, 2, 2);
  return c;
};

LQ.renderCarillon = function () {
  // Tall brick bell tower: belfry with bells, clock faces, copper cap.
  const W = 32, H = 112;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const cx = c.getContext('2d');
  const k = '#181820';
  // Cap
  cx.fillStyle = k;
  cx.fillRect(14, 0, 4, 2);
  for (let i = 0; i < 12; i++) cx.fillRect(14 - i, 2 + i, 4 + i * 2, 1);
  cx.fillStyle = '#58a890';
  for (let i = 1; i < 12; i++) cx.fillRect(15 - i, 2 + i, 2 + i * 2 - 2, 1);
  // Shaft
  cx.fillStyle = k;
  cx.fillRect(3, 14, 26, H - 14);
  cx.fillStyle = '#b86048';
  cx.fillRect(4, 15, 24, H - 16);
  cx.fillStyle = '#a04c38';
  for (let y = 18; y < H - 2; y += 3) for (let x = 4 + ((y / 3) % 2) * 3; x < 28; x += 6) cx.fillRect(x, y, 4, 1);
  // Belfry opening with bells
  cx.fillStyle = '#281818';
  cx.fillRect(7, 18, 18, 16);
  cx.fillStyle = '#d8a838';
  [[9, 22], [17, 22], [13, 27]].forEach(([x, y]) => { cx.fillRect(x + 1, y, 4, 2); cx.fillRect(x, y + 2, 6, 3); });
  // Clock
  cx.fillStyle = k;
  cx.fillRect(8, 40, 16, 16);
  cx.fillStyle = '#f8f0e0';
  cx.fillRect(9, 41, 14, 14);
  cx.fillStyle = k;
  cx.fillRect(15, 43, 2, 6);
  cx.fillRect(16, 47, 5, 2);
  // Stone trim bands
  cx.fillStyle = '#e8dcc8';
  [15, 36, 60, H - 6].forEach((y) => cx.fillRect(4, y, 24, 2));
  // Door at base
  cx.fillStyle = k;
  cx.fillRect(11, H - 20, 10, 20);
  cx.fillStyle = '#5a3a28';
  cx.fillRect(12, H - 19, 8, 19);
  return c;
};

// ------------------------------------------------------------ furniture
LQ.renderFurniture = function (f) {
  const W = f.w * 16, H = f.h * 16 + 8;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const cx = c.getContext('2d');
  const k = '#181820';
  const box = (top, front) => {
    cx.fillStyle = k;
    cx.fillRect(0, 0, W, H);
    cx.fillStyle = top;
    cx.fillRect(1, 1, W - 2, H - 12);
    cx.fillStyle = front;
    cx.fillRect(1, H - 11, W - 2, 10);
  };
  switch (f.type) {
    case 'shelf': {
      box('#8a5a38', '#6a4028');
      const books = ['#e04848', '#4878e0', '#48b860', '#f0c040', '#a060d0', '#f8f8f8'];
      for (let row = 0; row < f.h; row++)
        for (let x = 2; x < W - 3; x += 3) {
          cx.fillStyle = books[Math.floor(LQ.hash(x, row + f.x * 3 + f.y, 4) * books.length)];
          cx.fillRect(x, 3 + row * 16, 2, 9);
        }
      break;
    }
    case 'counter':
      box('#e8e0d0', '#0032a0');
      cx.fillStyle = '#f8f8f8';
      cx.fillRect(1, H - 8, W - 2, 1);
      break;
    case 'table':
      box('#c89060', '#a07040');
      cx.fillStyle = '#f8f8f8';
      cx.fillRect(4, 4, 6, 4);
      break;
    case 'bed':
      box('#f8f8f8', '#4868b0');
      cx.fillStyle = '#4878e0';
      cx.fillRect(1, 12, W - 2, H - 24);
      cx.fillStyle = '#f8f8f8';
      cx.fillRect(3, 3, W - 6, 7);
      break;
    case 'desk':
      box('#a8a8b8', '#787888');
      cx.fillStyle = '#283040';
      cx.fillRect(4, 3, 10, 7);
      cx.fillStyle = '#70e0a0';
      cx.fillRect(5, 4, 8, 5);
      break;
    case 'plant':
      cx.fillStyle = '#c86040';
      cx.fillRect(4, H - 10, 8, 10);
      cx.fillStyle = '#3a8a3a';
      cx.fillRect(2, H - 22, 12, 13);
      cx.fillStyle = '#58b058';
      cx.fillRect(4, H - 20, 4, 6);
      break;
    case 'machine':
      box('#d84848', '#a83030');
      cx.fillStyle = '#c8e8ff';
      cx.fillRect(3, 3, W - 6, H - 18);
      cx.fillStyle = '#f8d040';
      for (let i = 0; i < 3; i++) cx.fillRect(5 + i * 4, 6, 2, 2);
      break;
    case 'gym':
      box('#808090', '#505060');
      cx.fillStyle = '#181820';
      cx.fillRect(2, 6, W - 4, 2);
      cx.fillRect(2, 3, 3, 8);
      cx.fillRect(W - 5, 3, 3, 8);
      break;
    default:
      box('#c0c0c0', '#909090');
  }
  return c;
};
