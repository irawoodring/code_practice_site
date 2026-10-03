// Main game: state machine, overworld, dialogue, menus, saving.
window.LQ = window.LQ || {};

const SAVE_KEY = 'laker_quest_save_v1';

LQ.Game = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.t = 0;
    this.state = 'title';
    this.titleCursor = 0;
    this.maps = {};
    this.flags = {};
    this.dialog = null;
    this.menu = null;
    this.fade = null;
    this.popup = null;
    this.playerSprites = LQ.buildCharacter(LQ.LOOKS.player);
    this.lookCache = {};
    this.titleBg = new LQ.BattleBG({ pattern: 'waves', colors: ['#5b8def', '#0032a0', '#001850'], dist: 'horiz', speed: 1 });
  }

  // ======================================================== setup
  hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }

  getMap(id) {
    if (!this.maps[id]) this.maps[id] = id === 'campus' ? LQ.buildCampus() : LQ.buildInterior(LQ.INTERIORS[id]);
    return this.maps[id];
  }

  newGame(name) {
    this.player = LQ.newPlayer(name);
    this.flags = {};
    this.enterMap('frey', null);
    this.say([
      '@Grand Valley State University. Allendale, Michigan.',
      '@It is the first week of fall semester.',
      '@Last night, at midnight, the Cook Carillon rang thirteen times.',
      '@Nobody knows why. But since then, something on campus has felt... off.',
      '@(Arrow keys: walk. Shift: run. Z: talk / check. X: menu. M: map.)',
    ]);
  }

  save() {
    const data = { player: this.player, flags: this.flags, map: this.map.id, x: this.pl.x, y: this.pl.y };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
  }

  load() {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE_KEY));
      this.player = Object.assign(LQ.newPlayer(), data.player);
      this.flags = data.flags || {};
      this.enterMap(data.map, { x: data.x, y: data.y, dir: 'down' });
      return true;
    } catch (e) { return false; }
  }

  // Put the player on a map. spot: {x, y} in pixels (feet) or null for the
  // interior's entrance.
  enterMap(id, spot) {
    const m = this.getMap(id);
    this.map = m;
    this.state = 'world';
    if (!spot) {
      if (m.id === 'campus') spot = { x: 86 * 16 + 8, y: 20 * 16, dir: 'down' };
      else spot = { x: (Math.floor(m.w / 2)) * 16, y: (m.h - 2) * 16 + 12, dir: 'up' };
    }
    this.pl = { x: spot.x, y: spot.y, dir: spot.dir || 'down', frame: 0, anim: 0, moving: false };
    this.npcs = LQ.NPCS.filter((n) => n.map === id).map((n) => ({
      def: n, x: n.x * 16 + 8, y: n.y * 16 + 14, homeX: n.x * 16 + 8, homeY: n.y * 16 + 14,
      dir: n.dir || 'down', frame: 0, anim: 0, wanderT: LQ.rand(30, 120), vx: 0, vy: 0,
      sprites: this.spritesFor(n.look),
    }));
    if (m.id === 'campus') this.clearUnderNpcs(m);
    this.phone = m.def && m.def.phone ? m.def.phone : null;
    if (this.phone) m.solidOverride.set(this.phone.y * m.w + this.phone.x, true);
    this.spawnEnemies();
    this.areaName = m.name;
    this.areaNameT = m.id === 'campus' ? 0 : 120;
  }

  clearUnderNpcs(m) {
    for (const n of this.npcs) {
      const tx = Math.floor(n.x / 16), ty = Math.floor(n.y / 16);
      if (m.get(tx, ty) === LQ.T.TREE) {
        m.set(tx, ty, LQ.T.GRASS);
        m.treeRows[ty] = m.treeRows[ty].filter((t) => t.x !== tx);
      }
    }
  }

  spritesFor(look) {
    if (!this.lookCache[look]) this.lookCache[look] = LQ.buildCharacter(LQ.LOOKS[look]);
    return this.lookCache[look];
  }

  // ======================================================== enemies
  spawnEnemies() {
    this.enemies = [];
    if (this.map.id === 'campus') {
      this.spawnGroups = LQ.SPAWNS.map((s) => Object.assign({}, s));
      if (this.flags.bossBeaten) this.spawnGroups.forEach((g) => { g.count = Math.ceil(g.count / 2); });
    } else {
      const ens = (this.map.def.enemies || []).filter(() => !this.flags.bossBeaten);
      this.spawnGroups = ens.map((e) => ({ type: e.type, x: 1, y: 4, w: this.map.w - 2, h: this.map.h - 6, count: e.count }));
    }
    for (const g of this.spawnGroups) for (let i = 0; i < g.count; i++) this.spawnOne(g, true);
    this.respawnT = 0;
  }

  spawnOne(g, initial) {
    for (let tries = 0; tries < 30; tries++) {
      const tx = g.x + LQ.rand(0, g.w - 1), ty = g.y + LQ.rand(0, g.h - 1);
      if (this.map.isSolid(tx, ty) || this.map.get(tx, ty) === LQ.T.DOOR) continue;
      const x = tx * 16 + 8, y = ty * 16 + 12;
      const d = Math.hypot(x - this.pl.x, y - this.pl.y);
      if (d < (initial ? 120 : 220)) continue;
      const def = LQ.ENEMIES[g.type];
      this.enemies.push({
        type: g.type, group: g, x, y, dir: 1, mode: 'wander', t: LQ.rand(0, 60), vx: 0, vy: 0,
        sprite: LQ.getEnemySprite(def.art, 1), spriteFlip: null, cool: 0,
      });
      return;
    }
  }

  updateEnemies() {
    const p = this.pl;
    for (const e of this.enemies) {
      const def = LQ.ENEMIES[e.type];
      const dx = p.x - e.x, dy = p.y - e.y;
      const dist = Math.hypot(dx, dy);
      const weak = this.player.level >= def.level + 5;
      if (e.cool > 0) e.cool--;
      if (dist < 90 && e.cool === 0 && !this.dialog) e.mode = weak ? 'flee' : 'chase';
      else if (dist > 150) e.mode = 'wander';

      let speed = 0.45;
      if (e.mode === 'chase') {
        speed = 0.8 + Math.min(0.7, def.spd / 25);
        e.vx = dx / (dist || 1); e.vy = dy / (dist || 1);
      } else if (e.mode === 'flee') {
        speed = 1.0;
        e.vx = -dx / (dist || 1); e.vy = -dy / (dist || 1);
      } else if (--e.t <= 0) {
        e.t = LQ.rand(40, 120);
        if (LQ.chance(0.35)) { e.vx = 0; e.vy = 0; }
        else { const a = Math.random() * Math.PI * 2; e.vx = Math.cos(a); e.vy = Math.sin(a); }
      }
      this.moveBody(e, e.vx * speed, e.vy * speed, 10, 6, true);
      // Keep wanderers near their spawn area.
      const g = e.group;
      if (e.mode === 'wander' && (e.x < g.x * 16 || e.x > (g.x + g.w) * 16 || e.y < g.y * 16 || e.y > (g.y + g.h) * 16)) {
        e.vx = ((g.x + g.w / 2) * 16 - e.x) > 0 ? 1 : -1;
        e.vy = ((g.y + g.h / 2) * 16 - e.y) > 0 ? 1 : -1;
      }
      if (e.vx > 0.1) e.dir = 1; else if (e.vx < -0.1) e.dir = -1;

      if (dist < 13 && !this.fade && !this.dialog) {
        let advantage = null;
        if (e.mode !== 'chase') advantage = 'player';
        else {
          // Hit from behind: enemy is on the opposite side of where you face.
          const facing = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.dir];
          if (facing[0] * -dx + facing[1] * -dy < 0 && LQ.chance(0.5)) advantage = 'enemy';
        }
        this.startBattle(e, advantage);
        return;
      }
    }

    // Respawn slowly, out of sight.
    if (++this.respawnT > 900) {
      this.respawnT = 0;
      for (const g of this.spawnGroups) {
        const alive = this.enemies.filter((e) => e.group === g).length;
        if (alive < g.count) this.spawnOne(g, false);
      }
    }
  }

  startBattle(enemyRef, advantage, typeOverride) {
    LQ.Sound.encounter();
    this.battleEnemy = enemyRef;
    const type = typeOverride || enemyRef.type;
    this.swirl = { t: 0, color: advantage === 'player' ? '#40d070' : advantage === 'enemy' ? '#e04040' : '#4060e0' };
    this.state = 'swirl';
    this.pendingBattle = () => { this.battle = new LQ.Battle(this, type, { advantage }); this.state = 'battle'; };
  }

  endBattle(result) {
    const enemyRef = this.battleEnemy;
    this.battle = null;
    if (result === 'lose') { this.state = 'gameover'; this.goCursor = 0; return; }
    this.state = 'world';
    if (result === 'win') {
      if (enemyRef && enemyRef !== 'boss') this.enemies = this.enemies.filter((e) => e !== enemyRef);
      if (enemyRef === 'boss') { this.flags.bossBeaten = true; this.startEnding(); return; }
    } else if (result === 'run' && enemyRef && enemyRef.cool !== undefined) {
      enemyRef.cool = 180;
      enemyRef.mode = 'flee';
    }
    // Brief grace period so you don't instantly bump into another enemy.
    for (const e of this.enemies) if (Math.hypot(e.x - this.pl.x, e.y - this.pl.y) < 40) { e.cool = 120; e.mode = 'wander'; }
  }

  // ======================================================== movement
  // Body position is the feet; collision box is w x h above the feet.
  moveBody(b, dx, dy, w, h, isEnemy) {
    const m = this.map;
    const tryMove = (nx, ny) => {
      if (m.boxBlocked(nx - w / 2, ny - h, w, h)) return false;
      if (isEnemy) {
        const tx = Math.floor(nx / 16), ty = Math.floor(ny / 16);
        const t = m.get(tx, ty);
        if (t === LQ.T.DOOR || t === LQ.T.EXIT) return false;
      }
      return true;
    };
    if (dx && tryMove(b.x + dx, b.y)) b.x += dx;
    if (dy && tryMove(b.x, b.y + dy)) b.y += dy;
  }

  updatePlayer() {
    const I = LQ.Input, p = this.pl;
    let dx = 0, dy = 0;
    if (I.held('left')) dx -= 1;
    if (I.held('right')) dx += 1;
    if (I.held('up')) dy -= 1;
    if (I.held('down')) dy += 1;
    p.moving = !!(dx || dy);
    if (p.moving) {
      if (dy < 0) p.dir = 'up'; else if (dy > 0) p.dir = 'down';
      if (dx && !dy) p.dir = dx < 0 ? 'left' : 'right';
      const speed = I.held('run') ? 2.4 : 1.4;
      const len = Math.hypot(dx, dy);
      const ox = p.x, oy = p.y;
      this.moveBody(p, dx / len * speed, dy / len * speed, 10, 6);
      // Blocked by an NPC? Undo.
      for (const n of this.npcs) if (Math.abs(n.x - p.x) < 11 && Math.abs(n.y - p.y) < 7) { p.x = ox; p.y = oy; }
      p.anim += speed;
      p.frame = Math.floor(p.anim / 8) % 4;
    } else {
      p.frame = 0;
      p.anim = 0;
    }

    // Doors, exits.
    const tx = Math.floor(p.x / 16), ty = Math.floor((p.y - 3) / 16);
    const t = this.map.get(tx, ty);
    if (this.map.id === 'campus' && t === LQ.T.DOOR && p.dir === 'up') {
      const door = this.map.doors.find((d) => d.x === tx && d.y === ty);
      if (door && door.interior) this.transition(() => this.enterInterior(door));
    } else if (t === LQ.T.EXIT && p.dir === 'down') {
      this.transition(() => this.exitInterior());
    }

    // Building name popup near doors (helps learn the campus).
    this.popup = null;
    if (this.map.id === 'campus') {
      for (const d of this.map.doors) {
        if (Math.abs(d.x * 16 + 8 - p.x) < 40 && p.y - d.y * 16 > 0 && p.y - d.y * 16 < 56) { this.popup = d.building.name; break; }
      }
      const c = this.map.carillon;
      if (!this.popup && Math.abs(c.x * 16 + 16 - p.x) < 40 && p.y - (c.y + 2) * 16 > -8 && p.y - (c.y + 2) * 16 < 48) this.popup = 'Cook Carillon Tower';
    }

    if (I.hit('ok')) this.interact();
    else if (I.hit('cancel') || I.hit('menu')) this.openMenu();
    else if (I.hit('map')) this.openMap();
  }

  enterInterior(door) {
    this.returnSpot = { x: door.x * 16 + 8, y: (door.y + 1) * 16 + 12, dir: 'down' };
    this.enterMap(door.interior, null);
  }

  exitInterior() {
    const spot = this.returnSpot || this.findDoorSpot(this.map.id);
    this.enterMap('campus', spot);
  }

  findDoorSpot(interiorId) {
    const campus = this.getMap('campus');
    const d = campus.doors.find((dd) => dd.interior === interiorId);
    return d ? { x: d.x * 16 + 8, y: (d.y + 1) * 16 + 12, dir: 'down' } : null;
  }

  transition(cb) {
    if (this.fade) return;
    this.fade = { t: 0, cb };
  }

  updateNpcs() {
    for (const n of this.npcs) {
      if (!n.def.wander || this.dialog) { n.frame = 0; continue; }
      if (--n.wanderT <= 0) {
        n.wanderT = LQ.rand(60, 160);
        const dirs = [['up', 0, -1], ['down', 0, 1], ['left', -1, 0], ['right', 1, 0], null, null];
        const d = LQ.pick(dirs);
        if (d) { n.dir = d[0]; n.vx = d[1] * 0.5; n.vy = d[2] * 0.5; n.walkT = LQ.rand(16, 40); }
      }
      if (n.walkT > 0) {
        n.walkT--;
        const nx = n.x + n.vx, ny = n.y + n.vy;
        if (Math.abs(nx - n.homeX) < 40 && Math.abs(ny - n.homeY) < 40 && Math.hypot(nx - this.pl.x, ny - this.pl.y) > 14) this.moveBody(n, n.vx, n.vy, 10, 6, true);
        n.anim = (n.anim || 0) + 0.5;
        n.frame = Math.floor(n.anim / 8) % 4;
      } else n.frame = 0;
    }
  }

  // ======================================================== interaction
  interact() {
    const p = this.pl;
    const f = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.dir];
    const probe = (dist) => ({ x: p.x + f[0] * dist, y: p.y - 4 + f[1] * dist });
    for (const dist of [12, 28]) {
      const q = probe(dist);
      const npc = this.npcs.find((n) => Math.abs(n.x - q.x) < 11 && Math.abs(n.y - 6 - q.y) < 12);
      if (npc) { this.talkTo(npc); return; }
      const tx = Math.floor(q.x / 16), ty = Math.floor(q.y / 16);
      // Can talk across counters, but nothing else reaches two tiles.
      if (dist === 28) break;
      if (this.map.get(tx, ty) !== LQ.T.FURN) {
        if (this.checkTile(tx, ty)) return;
        break;
      }
    }
  }

  checkTile(tx, ty) {
    const m = this.map;
    if (this.phone && tx === this.phone.x && ty === this.phone.y) { this.usePhone(); return true; }
    const sign = m.signs.find((s) => s.x === tx && s.y === ty);
    if (sign) { this.say(sign.text.split('\n').length > 1 ? [sign.text.replace(/\n/g, ' ')] : [sign.text]); return true; }
    if (m.id === 'campus') {
      const c = m.carillon;
      if (tx >= c.x && tx < c.x + c.w && ty >= c.y && ty < c.y + c.h) { this.checkCarillon(); return true; }
      const door = m.doors.find((d) => d.x === tx && d.y === ty);
      if (door && !door.interior) {
        const b = door.building;
        const msg = b.style === 'house' ? 'Nobody answers. Probably at work.' : 'The doors to ' + b.name + ' are locked. Classes must be out for the day.';
        this.say([msg]);
        return true;
      }
      const b = m.buildingAt(tx, ty);
      if (b) { this.say(['@' + b.name + '.']); return true; }
      const t = m.get(tx, ty);
      if (t === LQ.T.WATER) { this.say(['@The water is cold. Michigan cold.']); return true; }
      if (t === LQ.T.RAVINE) { this.say(['@A steep, wooded ravine. Way too steep to climb down.']); return true; }
    }
    return false;
  }

  checkCarillon() {
    if (this.flags.bossBeaten) {
      this.say(['@The Cook Carillon rings out a clear, perfect melody.', '@48 bells, all in tune.']);
      return;
    }
    if (!this.has('key')) {
      LQ.Sound.offKeyBell();
      this.say(['@The Cook Carillon Tower. Something inside is humming, deep and sour.', '@The door is locked. A small plaque reads: "Authorized bell-ringers only."']);
      return;
    }
    this.say([
      '@You unlock the tower door with the Tower Key...',
      '@The bells above you begin to swing on their own. The sound is WRONG.',
      '@Something huge drops down the shaft!',
    ], () => { this.startBattle('boss', null, 'bell'); });
  }

  usePhone() {
    this.ask('A campus phone. Call home and save your progress?', (yes) => {
      if (!yes) return;
      const ok = this.save();
      this.say(ok
        ? ['Hi, sweetie! It\'s Mom.', 'You\'re eating enough, right? And wearing a coat? It gets windy out there.', 'I wrote down everything you told me. (Progress saved.)', 'Love you! Go Lakers!']
        : ['@The line is dead. (Saving is unavailable in this browser.)']);
    });
  }

  talkTo(npc) {
    const p = this.pl;
    const dx = p.x - npc.x, dy = p.y - npc.y;
    npc.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    const lines = npc.def.talk(this);
    if (lines) this.say(lines, null, npc.def.name);
  }

  // Helpers for NPC scripts.
  has(id) { return this.player.goods.includes(id); }
  giveItem(id) { this.player.goods.push(id); }
  fullHeal() { this.player.hp = this.player.maxHp; this.player.pp = this.player.maxPp; LQ.Sound.heal(); }
  equipBonus(stat) {
    let b = 0;
    for (const id of Object.values(this.player.equipped)) if (id && LQ.ITEMS[id][stat]) b += LQ.ITEMS[id][stat];
    return b;
  }

  offerInn(text, cost) {
    this.ask(text, (yes) => {
      if (!yes) { this.say(['Come back anytime!']); return; }
      if (this.player.money < cost) { this.say(['Oh... you don\'t have enough money. Sorry!']); return; }
      this.player.money -= cost;
      this.fullHeal();
      this.say(['Here you go! Extra foam.', '@' + this.player.name + '\'s HP and PP were fully restored!']);
    });
  }

  openShop(greeting, stock) {
    this.say([greeting], () => { this.menu = { kind: 'shop', stock, cursor: 0 }; });
  }

  // ======================================================== dialogue
  say(lines, onDone, speaker) {
    this.dialog = { lines: lines.slice(), idx: 0, shown: 0, onDone, speaker, choice: null };
  }

  ask(text, cb) {
    this.dialog = { lines: [text], idx: 0, shown: 0, onDone: null, ask: cb, choice: 0 };
  }

  updateDialog() {
    const d = this.dialog, I = LQ.Input;
    const raw = d.lines[d.idx];
    const text = raw.startsWith('@') ? raw.slice(1) : raw;
    if (d.shown < text.length) {
      d.shown += I.held('ok') ? 4 : 1.5;
      if (this.t % 3 === 0) LQ.Sound.text();
      if (I.hit('ok')) d.shown = text.length;
      return;
    }
    const last = d.idx === d.lines.length - 1;
    if (d.ask && last) {
      if (I.hit('left') || I.hit('right') || I.hit('up') || I.hit('down')) { d.choice = 1 - d.choice; LQ.Sound.cursor(); }
      if (I.hit('cancel')) { d.choice = 1; }
      if (I.hit('ok') || I.hit('cancel')) {
        LQ.Sound.select();
        const cb = d.ask, yes = d.choice === 0;
        this.dialog = null;
        cb(yes);
      }
      return;
    }
    if (I.hit('ok') || I.hit('cancel')) {
      if (last) {
        const cb = d.onDone;
        this.dialog = null;
        if (cb) cb();
      } else {
        d.idx++;
        d.shown = 0;
      }
    }
  }

  drawDialog(ctx) {
    const d = this.dialog;
    const raw = d.lines[d.idx];
    const narr = raw.startsWith('@');
    const text = narr ? raw.slice(1) : raw;
    const lines = LQ.wrapText(text, 220);
    const h = Math.max(3, lines.length) * LQ.LINE_HEIGHT + 14;
    const y = 8;
    LQ.drawWindow(ctx, 8, y, 240, h);
    let left = Math.floor(d.shown);
    lines.forEach((line, i) => {
      LQ.drawText(ctx, line.slice(0, Math.max(0, left)), 18, y + 8 + i * LQ.LINE_HEIGHT, LQ.COLORS.text);
      left -= line.length + 1;
    });
    if (d.speaker && !narr) {
      const w = LQ.textWidth(d.speaker) + 16;
      LQ.drawWindow(ctx, 14, y + h - 2, w, 16);
      LQ.drawText(ctx, d.speaker, 22, y + h + 2, LQ.COLORS.highlight);
    }
    const done = d.shown >= text.length;
    if (done && d.ask && d.idx === d.lines.length - 1) {
      LQ.drawWindow(ctx, 176, y + h + 2, 64, 34);
      LQ.drawText(ctx, 'Yes', 196, y + h + 9, LQ.COLORS.text);
      LQ.drawText(ctx, 'No', 196, y + h + 21, LQ.COLORS.text);
      LQ.drawCursor(ctx, 184, y + h + 9 + d.choice * 12, this.t);
    } else if (done) {
      LQ.drawMoreArrow(ctx, 236, y + h - 9, this.t);
    }
  }

  // ======================================================== menus
  openMenu() {
    LQ.Sound.select();
    this.menu = { kind: 'main', cursor: 0 };
  }

  openMap() {
    LQ.Sound.select();
    this.menu = { kind: 'map' };
  }

  updateMenu() {
    const I = LQ.Input, m = this.menu, p = this.player;
    const nav = (len) => {
      if (I.hit('down')) { m.cursor = (m.cursor + 1) % len; LQ.Sound.cursor(); }
      if (I.hit('up')) { m.cursor = (m.cursor + len - 1) % len; LQ.Sound.cursor(); }
    };
    switch (m.kind) {
      case 'main': {
        const opts = ['Goods', 'PSI', 'Status', 'Map'];
        nav(opts.length);
        if (I.hit('cancel') || I.hit('menu')) { this.menu = null; LQ.Sound.cancel(); return; }
        if (I.hit('ok')) {
          LQ.Sound.select();
          const o = opts[m.cursor];
          if (o === 'Goods' && p.goods.length) this.menu = { kind: 'goods', cursor: 0, parent: m };
          if (o === 'PSI' && p.psi.length) this.menu = { kind: 'psi', cursor: 0, parent: m };
          if (o === 'Status') this.menu = { kind: 'status', parent: m };
          if (o === 'Map') this.menu = { kind: 'map', parent: m };
        }
        break;
      }
      case 'goods': {
        if (!p.goods.length) { this.menu = m.parent; return; }
        m.cursor = Math.min(m.cursor, p.goods.length - 1);
        nav(p.goods.length);
        if (I.hit('cancel')) { this.menu = m.parent; LQ.Sound.cancel(); return; }
        if (I.hit('ok')) { LQ.Sound.select(); this.menu = { kind: 'goodsAct', cursor: 0, parent: m, index: m.cursor }; }
        break;
      }
      case 'goodsAct': {
        const opts = ['Use', 'Look', 'Drop'];
        if (I.hit('right') || I.hit('down')) { m.cursor = (m.cursor + 1) % 3; LQ.Sound.cursor(); }
        if (I.hit('left') || I.hit('up')) { m.cursor = (m.cursor + 2) % 3; LQ.Sound.cursor(); }
        if (I.hit('cancel')) { this.menu = m.parent; LQ.Sound.cancel(); return; }
        if (I.hit('ok')) {
          LQ.Sound.select();
          const id = p.goods[m.index], it = LQ.ITEMS[id];
          const back = () => { this.menu = m.parent; };
          if (opts[m.cursor] === 'Look') { this.menu = null; this.say(['@' + it.name + ': ' + it.desc], back); }
          else if (opts[m.cursor] === 'Drop') {
            this.menu = null;
            if (it.kind === 'key') this.say(['@You can\'t drop that! It seems important.'], back);
            else { if (Object.values(p.equipped).includes(id) && p.goods.filter((g) => g === id).length === 1) this.unequip(id); p.goods.splice(m.index, 1); this.say(['@You dropped the ' + it.name + '.'], back); }
          } else this.useItemField(m.index, back);
        }
        break;
      }
      case 'psi': {
        nav(p.psi.length);
        if (I.hit('cancel')) { this.menu = m.parent; LQ.Sound.cancel(); return; }
        if (I.hit('ok')) {
          const psi = LQ.PSI[p.psi[m.cursor]];
          const back = () => { this.menu = m; };
          if (psi.kind !== 'heal') { this.menu = null; this.say(['@You can only use ' + psi.name + ' in battle.'], back); }
          else if (p.pp < psi.pp) { LQ.Sound.cancel(); }
          else if (p.hp >= p.maxHp) { this.menu = null; this.say(['@You\'re already at full HP.'], back); }
          else {
            p.pp -= psi.pp;
            const amt = LQ.rand(psi.amount[0], psi.amount[1]);
            p.hp = Math.min(p.maxHp, p.hp + amt);
            LQ.Sound.heal();
            this.menu = null;
            this.say(['@' + p.name + ' tried ' + psi.name + '!', '@' + p.name + ' recovered ' + amt + ' HP!'], back);
          }
        }
        break;
      }
      case 'status':
      case 'map':
        if (I.hit('cancel') || I.hit('ok') || I.hit('map') || I.hit('menu')) { this.menu = m.parent || null; LQ.Sound.cancel(); }
        break;
      case 'shop': {
        nav(m.stock.length + 1);
        if (I.hit('cancel') || (I.hit('ok') && m.cursor === m.stock.length)) { this.menu = null; this.say(['Thanks! Come again!']); return; }
        if (I.hit('ok')) {
          const id = m.stock[m.cursor], it = LQ.ITEMS[id];
          this.menu = null;
          this.ask('The ' + it.name + ' is $' + it.price + '. ' + it.desc + ' Buy it?', (yes) => {
            const back = () => { this.menu = m; };
            if (!yes) { back(); return; }
            if (p.money < it.price) this.say(['You don\'t have enough money.'], back);
            else if (p.goods.length >= 14) this.say(['Your backpack is full!'], back);
            else { p.money -= it.price; p.goods.push(id); LQ.Sound.select(); this.say(['@You bought the ' + it.name + '!'], back); }
          });
        }
        break;
      }
    }
  }

  unequip(id) {
    for (const [slot, eid] of Object.entries(this.player.equipped)) if (eid === id) delete this.player.equipped[slot];
  }

  useItemField(index, back) {
    const p = this.player, id = p.goods[index], it = LQ.ITEMS[id];
    this.menu = null;
    if (it.kind === 'equip') {
      if (p.equipped[it.slot] === id) { delete p.equipped[it.slot]; this.say(['@You took off the ' + it.name + '.'], back); }
      else {
        p.equipped[it.slot] = id;
        const stat = it.off ? 'Offense +' + it.off : 'Defense +' + it.def;
        this.say(['@You equipped the ' + it.name + '! (' + stat + ')'], back);
      }
      return;
    }
    if (it.kind === 'key') { this.say(['@' + it.desc, '@Now is not the time to use this.'], back); return; }
    if (it.kind === 'attack') { this.say(['@Better save that for a fight.'], back); return; }
    p.goods.splice(index, 1);
    const lines = ['@You used the ' + it.name + '.'];
    if (it.hp) { p.hp = Math.min(p.maxHp, p.hp + it.hp); lines.push('@Recovered ' + it.hp + ' HP!'); }
    if (it.pp) { p.pp = Math.min(p.maxPp, p.pp + it.pp); lines.push('@Recovered ' + it.pp + ' PP!'); }
    LQ.Sound.heal();
    this.say(lines, back);
  }

  drawMenu(ctx) {
    const m = this.menu, p = this.player;
    const listWindow = (items, cursor, x, y, w, labelFn, rightFn) => {
      const rows = Math.min(items.length, 10);
      const start = LQ.clamp(cursor - 9, 0, Math.max(0, items.length - 10));
      LQ.drawWindow(ctx, x, y, w, rows * 14 + 14);
      for (let i = 0; i < rows; i++) {
        const it = items[start + i], yy = y + 7 + i * 14;
        LQ.drawText(ctx, labelFn(it), x + 18, yy, LQ.COLORS.text);
        if (rightFn) { const r = rightFn(it); LQ.drawText(ctx, r, x + w - 10 - LQ.textWidth(r), yy, LQ.COLORS.text); }
        if (start + i === cursor) LQ.drawCursor(ctx, x + 6, yy, this.t);
      }
    };
    const moneyBox = () => {
      const s = '$' + p.money;
      LQ.drawWindow(ctx, 176, 8, 72, 22);
      LQ.drawText(ctx, s, 240 - LQ.textWidth(s) - 4, 15, LQ.COLORS.text);
    };
    const drawMain = () => {
      listWindow(['Goods', 'PSI', 'Status', 'Map'], m.kind === 'main' ? m.cursor : -1, 8, 8, 72, (s) => s);
      moneyBox();
      this.drawMiniStatus(ctx);
    };
    switch (m.kind) {
      case 'main': drawMain(); break;
      case 'goods': case 'goodsAct': {
        const gm = m.kind === 'goods' ? m : m.parent;
        drawMain();
        listWindow(p.goods, gm.cursor, 84, 8, 132, (id) => {
          const eq = Object.values(p.equipped).includes(id);
          return (eq ? '*' : '') + LQ.ITEMS[id].name;
        });
        if (m.kind === 'goodsAct') {
          LQ.drawWindow(ctx, 84, 168, 160, 22);
          ['Use', 'Look', 'Drop'].forEach((o, i) => {
            LQ.drawText(ctx, o, 102 + i * 48, 175, LQ.COLORS.text);
            if (i === m.cursor) LQ.drawCursor(ctx, 92 + i * 48, 175, this.t);
          });
        }
        break;
      }
      case 'psi':
        drawMain();
        listWindow(p.psi, m.cursor, 84, 8, 150, (id) => LQ.PSI[id].name, (id) => LQ.PSI[id].pp + 'PP');
        break;
      case 'status': this.drawStatusScreen(ctx); break;
      case 'map': this.drawMapScreen(ctx); break;
      case 'shop': {
        const items = m.stock.concat(['__done']);
        listWindow(items, m.cursor, 16, 8, 176, (id) => (id === '__done' ? 'Done' : LQ.ITEMS[id].name), (id) => (id === '__done' ? '' : '$' + LQ.ITEMS[id].price));
        LQ.drawWindow(ctx, 176, 190, 72, 22);
        const s = '$' + p.money;
        LQ.drawText(ctx, s, 240 - LQ.textWidth(s) - 4, 197, LQ.COLORS.text);
        break;
      }
    }
  }

  drawMiniStatus(ctx) {
    const p = this.player;
    LQ.drawWindow(ctx, 88, 160, 80, 56);
    LQ.drawText(ctx, p.name.slice(0, 10), 98, 167, LQ.COLORS.text);
    LQ.drawText(ctx, 'HP', 98, 183, LQ.COLORS.text);
    LQ.drawText(ctx, 'PP', 98, 199, LQ.COLORS.text);
    LQ.drawOdometer(ctx, 120, 180, p.hp);
    LQ.drawOdometer(ctx, 120, 196, p.pp);
  }

  drawStatusScreen(ctx) {
    const p = this.player;
    LQ.drawWindow(ctx, 8, 8, 240, 208);
    const lines = [
      [p.name, 'Level ' + p.level],
      ['HP', p.hp + ' / ' + p.maxHp],
      ['PP', p.pp + ' / ' + p.maxPp],
      ['Offense', p.off + (this.equipBonus('off') ? ' (+' + this.equipBonus('off') + ')' : '')],
      ['Defense', p.def + (this.equipBonus('def') ? ' (+' + this.equipBonus('def') + ')' : '')],
      ['Speed', String(p.spd)],
      ['Exp.', String(p.exp)],
      ['Next level', p.level >= LQ.MAX_LEVEL ? '--' : String(LQ.EXP_TABLE[p.level + 1] - p.exp)],
      ['Money', '$' + p.money],
    ];
    lines.forEach(([a, b], i) => {
      LQ.drawText(ctx, a, 22, 20 + i * 14, i === 0 ? LQ.COLORS.highlight : LQ.COLORS.text);
      LQ.drawText(ctx, b, 140, 20 + i * 14, LQ.COLORS.text);
    });
    const eq = Object.values(p.equipped).map((id) => LQ.ITEMS[id].name);
    LQ.drawText(ctx, 'Equipped:', 22, 156, LQ.COLORS.textDim);
    LQ.drawText(ctx, eq.length ? eq.join(', ').slice(0, 36) : '(nothing)', 22, 168, LQ.COLORS.text);
    const goal = this.flags.bossBeaten ? 'Campus is saved! Explore freely.'
      : this.has('key') ? 'Use the Tower Key at the Carillon.'
      : this.has('score') ? 'Get the Tower Key at Zumberge Hall.'
      : this.flags.metProf ? 'Get the Carillon Score at the library.'
      : 'Find Dr. Vanderwal at Kirkhof.';
    LQ.drawText(ctx, 'Goal: ' + goal, 22, 190, LQ.COLORS.highlight);
  }

  // Overview of the whole campus: 1 pixel per tile.
  getMapImage() {
    if (this.mapImage) return this.mapImage;
    const m = this.getMap('campus');
    const c = document.createElement('canvas');
    c.width = m.w;
    c.height = m.h;
    const cx = c.getContext('2d');
    const T = LQ.T;
    const col = {
      [T.GRASS]: '#78c060', [T.TREE]: '#3a8a3a', [T.FLOWERS]: '#78c060', [T.PATH]: '#e0dccc', [T.DOOR]: '#e0dccc',
      [T.BRICK]: '#d08870', [T.ROAD]: '#505060', [T.ROAD_LINE_H]: '#505060', [T.ROAD_LINE_V]: '#505060',
      [T.WATER]: '#4898e8', [T.RAVINE]: '#2a5a2a', [T.BRIDGE]: '#c09060', [T.TURF]: '#40a040', [T.FAIRWAY]: '#90d880',
      [T.SAND]: '#f0e0a0', [T.FARM]: '#a07848', [T.PARKING]: '#8a8a94', [T.BUILDING]: '#b85a48', [T.STANDS]: '#9898a8', [T.DIRT]: '#c8a070',
    };
    for (let y = 0; y < m.h; y++)
      for (let x = 0; x < m.w; x++) {
        cx.fillStyle = col[m.get(x, y)] || '#000';
        cx.fillRect(x, y, 1, 1);
      }
    cx.fillStyle = '#f8d040';
    cx.fillRect(m.carillon.x, m.carillon.y, 2, 2);
    this.mapImage = c;
    return c;
  }

  drawMapScreen(ctx) {
    ctx.fillStyle = '#101018';
    ctx.fillRect(0, 0, LQ.W, LQ.H);
    const img = this.getMapImage();
    const ox = 6, oy = 32;
    ctx.drawImage(img, ox, oy);
    ctx.strokeStyle = '#f8f8f8';
    ctx.strokeRect(ox - 0.5, oy - 0.5, img.width + 1, img.height + 1);
    LQ.drawText(ctx, 'GVSU Allendale & around', 8, 6, LQ.COLORS.highlight);
    LQ.drawText(ctx, 'N^   (X to close)', 8, 18, LQ.COLORS.textDim);

    const campus = this.getMap('campus');
    LQ.CAMPUS.mapLabels.forEach((l) => {
      const b = campus.buildings.find((bb) => bb.id === l.ref);
      LQ.drawText(ctx, l.abbr, ox + b.x + (l.dx || 0), oy + b.y + (l.dy || 0), '#f8f8f8', '#101018');
    });
    // The carillon gets a blinking marker instead of a label.
    const ca = LQ.CAMPUS.carillon;
    ctx.fillStyle = Math.floor(this.t / 15) % 2 ? '#f8d040' : '#c08010';
    ctx.fillRect(ox + ca.x - 1, oy + ca.y - 1, 4, 4);

    // Player dot (or the building they're inside).
    let px = this.pl.x / 16, py = this.pl.y / 16;
    if (this.map.id !== 'campus') { const s = this.returnSpot || this.findDoorSpot(this.map.id); if (s) { px = s.x / 16; py = s.y / 16; } }
    if (Math.floor(this.t / 10) % 2) { ctx.fillStyle = '#ff3030'; ctx.fillRect(ox + px - 1, oy + py - 1, 3, 3); }

    const legend = [
      ['LIB', 'Library'], ['KIR', 'Kirkhof'], ['ZUM', 'Zumberge'], ['GLP', 'Great Lks'],
      ['PAD', 'Padnos'], ['KLN', 'Kleiner'], ['FH', 'Fieldhs.'],
    ];
    const lx = 162;
    legend.forEach(([a, n], i) => {
      LQ.drawText(ctx, a, lx, 34 + i * 11, '#f8f8f8');
      LQ.drawText(ctx, n, lx + 28, 34 + i * 11, LQ.COLORS.textDim);
    });
    ctx.fillStyle = '#f8d040';
    ctx.fillRect(lx + 1, 124, 4, 4);
    LQ.drawText(ctx, 'Carillon', lx + 28, 122, LQ.COLORS.textDim);
    ctx.fillStyle = '#ff3030';
    ctx.fillRect(lx + 1, 135, 3, 3);
    LQ.drawText(ctx, 'You', lx + 28, 133, LQ.COLORS.textDim);
    LQ.drawText(ctx, 'M-45 north', lx, 154, '#f8d040');
    LQ.drawText(ctx, 'River east', lx, 166, '#88c8f8');
    LQ.drawText(ctx, 'Allendale', lx, 178, '#f8f8f8');
    LQ.drawText(ctx, '  west', lx, 189, '#f8f8f8');
  }

  // ======================================================== ending / game over
  startEnding() {
    this.state = 'ending';
    this.endT = 0;
    LQ.Sound.bell();
    this.endLines = [
      'The Discordant Carillon let out one last, sour BONNNG...',
      '...and then the bells settled into a clear, bright chord.',
      'Across campus, squirrels went back to burying acorns.',
      'The geese went back to being merely rude.',
      'The overdue books returned themselves.',
      'And from somewhere near Zumberge Pond, Louie the Laker gave a big thumbs up.',
      'Thanks to ' + this.player.name + ', Grand Valley was back in tune.',
      'THE END',
      '(Press Z to keep exploring campus.)',
    ];
  }

  updateEnding() {
    this.endT++;
    let idx = Math.floor(this.endT / 150);
    // Z skips ahead to the next line.
    if (LQ.Input.hit('ok') && idx < this.endLines.length - 1 && this.endT % 150 > 20) { this.endT = (idx + 1) * 150; idx++; }
    if (this.endT % 150 === 0 && idx < this.endLines.length - 1) LQ.Sound.tone(523 + idx * 40, 0.4, 'triangle', 0.05);
    if (idx >= this.endLines.length - 1 && this.endT % 150 > 30 && LQ.Input.hit('ok')) {
      this.state = 'world';
      this.player.hp = this.player.maxHp;
      this.player.pp = this.player.maxPp;
      this.spawnEnemies();
    }
  }

  drawEnding(ctx) {
    ctx.drawImage(this.titleBg.render(this.t), 0, 0);
    ctx.fillStyle = 'rgba(0,0,20,0.45)';
    ctx.fillRect(0, 0, LQ.W, LQ.H);
    const tower = this.carillonSprite || (this.carillonSprite = LQ.renderCarillon());
    ctx.drawImage(tower, 112, 20);
    const louie = this.spritesFor('louie').down[Math.floor(this.t / 16) % 2 ? 0 : 1];
    ctx.drawImage(louie, 150, 108);
    ctx.drawImage(this.playerSprites.down[0], 90, 108);
    const idx = Math.min(this.endLines.length - 1, Math.floor(this.endT / 150));
    const line = this.endLines[idx];
    const lines = LQ.wrapText(line, 220);
    LQ.drawWindow(ctx, 8, 150, 240, 60);
    lines.forEach((l, i) => LQ.drawText(ctx, l, 128 - Math.floor(LQ.textWidth(l) / 2), 160 + i * 12, line === 'THE END' ? LQ.COLORS.highlight : LQ.COLORS.text));
    if (Math.floor(this.t / 20) % 2 === 0) for (let i = 0; i < 6; i++) LQ.drawText(ctx, '♪', 40 + i * 36 + Math.round(Math.sin((this.t + i * 30) / 15) * 6), 30 + ((this.t / 2 + i * 20) % 90), '#f8e070');
  }

  updateGameOver() {
    const I = LQ.Input;
    if (I.hit('up') || I.hit('down')) { this.goCursor = 1 - this.goCursor; LQ.Sound.cursor(); }
    if (I.hit('ok')) {
      LQ.Sound.select();
      if (this.goCursor === 0) {
        const p = this.player;
        p.money = Math.floor(p.money / 2);
        p.hp = p.maxHp;
        p.pp = p.maxPp;
        let saved = null;
        try { saved = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { saved = null; }
        if (saved) this.enterMap(saved.map, { x: saved.x, y: saved.y, dir: 'down' });
        else this.enterMap('frey', null);
        this.say(['@You wake up feeling groggy, but okay.', '@Half of your money seems to have gone missing...']);
      } else {
        this.state = 'title';
      }
    }
  }

  drawGameOver(ctx) {
    ctx.fillStyle = '#100808';
    ctx.fillRect(0, 0, LQ.W, LQ.H);
    LQ.drawText(ctx, this.player.name + ' lost consciousness...', 128 - Math.floor(LQ.textWidth(this.player.name + ' lost consciousness...') / 2), 70, LQ.COLORS.text);
    LQ.drawText(ctx, 'Do you want to try again?', 56, 100, LQ.COLORS.text);
    LQ.drawWindow(ctx, 96, 120, 64, 36);
    LQ.drawText(ctx, 'Yes', 116, 128, LQ.COLORS.text);
    LQ.drawText(ctx, 'No', 116, 141, LQ.COLORS.text);
    LQ.drawCursor(ctx, 104, 128 + this.goCursor * 13, this.t);
  }

  // ======================================================== title / naming
  updateTitle() {
    const I = LQ.Input;
    const opts = this.titleOptions();
    if (I.hit('down')) { this.titleCursor = (this.titleCursor + 1) % opts.length; LQ.Sound.cursor(); }
    if (I.hit('up')) { this.titleCursor = (this.titleCursor + opts.length - 1) % opts.length; LQ.Sound.cursor(); }
    if (I.hit('ok')) {
      LQ.Sound.select();
      if (opts[this.titleCursor] === 'Continue') { if (!this.load()) this.state = 'title'; }
      else { this.state = 'naming'; this.nameBuf = ''; }
    }
  }

  titleOptions() { return this.hasSave() ? ['Continue', 'New Game'] : ['New Game']; }

  drawTitle(ctx) {
    ctx.drawImage(this.titleBg.render(this.t), 0, 0);
    const title = 'LAKER QUEST';
    // Big chunky title: draw each letter 3x.
    const scale = 3;
    let x = 128 - Math.floor(LQ.textWidth(title) * scale / 2);
    for (const ch of title) {
      const g = LQ.getGlyphCanvas(ch, '#f8f8f8');
      const sh = LQ.getGlyphCanvas(ch, '#101030');
      const bob = Math.round(Math.sin((this.t + x) / 14) * 2);
      ctx.drawImage(sh, x + 2, 42 + bob + 2, g.width * scale, g.height * scale);
      ctx.drawImage(g, x, 42 + bob, g.width * scale, g.height * scale);
      x += LQ.glyphWidth(ch) * scale;
    }
    const sub = 'An Allendale Adventure';
    LQ.drawText(ctx, sub, 128 - Math.floor(LQ.textWidth(sub) / 2), 80, '#f8e070', '#101030');
    ctx.drawImage(this.playerSprites.down[Math.floor(this.t / 12) % 4 === 1 ? 1 : 0], 120, 98);
    const opts = this.titleOptions();
    LQ.drawWindow(ctx, 84, 134, 88, opts.length * 14 + 14);
    opts.forEach((o, i) => {
      LQ.drawText(ctx, o, 104, 141 + i * 14, LQ.COLORS.text);
      if (i === this.titleCursor) LQ.drawCursor(ctx, 92, 141 + i * 14, this.t);
    });
    const hint = 'Z / Enter to select';
    LQ.drawText(ctx, hint, 128 - Math.floor(LQ.textWidth(hint) / 2), 206, '#c8d8ff', '#101030');
  }

  updateNaming() {
    for (const k of LQ.Input.typed) {
      if (k === 'Enter') {
        LQ.Sound.select();
        this.newGame(this.nameBuf.trim() || 'Laker');
        return;
      }
      if (k === 'Backspace') this.nameBuf = this.nameBuf.slice(0, -1);
      else if (k.length === 1 && LQ.FONT_GLYPHS[k] && this.nameBuf.length < 10) { this.nameBuf += k; LQ.Sound.cursor(); }
    }
  }

  drawNaming(ctx) {
    ctx.drawImage(this.titleBg.render(this.t), 0, 0);
    LQ.drawWindow(ctx, 24, 60, 208, 80);
    LQ.drawText(ctx, 'What is your name?', 40, 72, LQ.COLORS.text);
    const shown = this.nameBuf + (Math.floor(this.t / 20) % 2 ? '_' : ' ');
    LQ.drawText(ctx, shown, 40, 96, LQ.COLORS.highlight);
    LQ.drawText(ctx, 'Type, then press Enter.', 40, 120, LQ.COLORS.textDim);
  }

  // ======================================================== main update/draw
  update() {
    this.t++;
    if (this.fade) {
      this.fade.t++;
      if (this.fade.t === 16) this.fade.cb();
      if (this.fade.t >= 32) this.fade = null;
      return;
    }
    switch (this.state) {
      case 'title': this.updateTitle(); break;
      case 'naming': this.updateNaming(); break;
      case 'world':
        if (this.dialog) this.updateDialog();
        else if (this.menu) this.updateMenu();
        else { this.updatePlayer(); if (this.state === 'world' && !this.fade) this.updateEnemies(); }
        this.updateNpcs();
        if (this.areaNameT > 0) this.areaNameT--;
        break;
      case 'swirl':
        if (++this.swirl.t > 50) this.pendingBattle();
        break;
      case 'battle': this.battle.update(); break;
      case 'gameover': this.updateGameOver(); break;
      case 'ending': this.updateEnding(); break;
    }
  }

  draw() {
    const ctx = this.ctx;
    switch (this.state) {
      case 'title': this.drawTitle(ctx); break;
      case 'naming': this.drawNaming(ctx); break;
      case 'world': this.drawWorld(ctx); break;
      case 'swirl': this.drawWorld(ctx); this.drawSwirl(ctx); break;
      case 'battle': this.battle.draw(ctx); break;
      case 'gameover': this.drawGameOver(ctx); break;
      case 'ending': this.drawEnding(ctx); break;
    }
    if (this.fade) {
      const a = this.fade.t < 16 ? this.fade.t / 16 : (32 - this.fade.t) / 16;
      ctx.fillStyle = 'rgba(0,0,0,' + a + ')';
      ctx.fillRect(0, 0, LQ.W, LQ.H);
    }
  }

  drawSwirl(ctx) {
    const s = this.swirl;
    const cx = 128, cy = 112;
    const r = s.t * 6;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(s.t * 0.15);
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? s.color : '#101018';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, (i / 8) * Math.PI * 2, ((i + 1) / 8) * Math.PI * 2 - Math.min(0.7, 0.7 - s.t / 70));
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  drawWorld(ctx) {
    const m = this.map, p = this.pl;
    let camX, camY;
    const mw = m.w * 16, mh = m.h * 16;
    if (mw <= LQ.W) camX = -Math.floor((LQ.W - mw) / 2); else camX = LQ.clamp(Math.round(p.x - LQ.W / 2), 0, mw - LQ.W);
    if (mh <= LQ.H) camY = -Math.floor((LQ.H - mh) / 2); else camY = LQ.clamp(Math.round(p.y - 12 - LQ.H / 2), 0, mh - LQ.H);
    ctx.fillStyle = '#101018';
    ctx.fillRect(0, 0, LQ.W, LQ.H);
    ctx.drawImage(m.ground, -camX, -camY);

    // Animated water sparkle.
    const tx0 = Math.max(0, Math.floor(camX / 16)), ty0 = Math.max(0, Math.floor(camY / 16));
    const tx1 = Math.min(m.w - 1, tx0 + 17), ty1 = Math.min(m.h - 1, ty0 + 15);
    ctx.fillStyle = LQ.TILE_COLORS.waterLight;
    for (let y = ty0; y <= ty1; y++)
      for (let x = tx0; x <= tx1; x++)
        if (m.get(x, y) === LQ.T.WATER) {
          const ph = (this.t / 20 + LQ.hash(x, y, 77) * 6) % 6;
          const sx = x * 16 - camX + ((x * 5 + Math.floor(this.t / 30)) % 10), sy = y * 16 - camY + 4 + Math.floor(ph);
          ctx.fillRect(sx, sy, 4, 1);
          ctx.fillRect(sx + 6, sy + 6, 3, 1);
        }

    // Gather y-sorted drawables in view.
    const draws = [];
    const inView = (x, y, w, h) => x + w > camX && x < camX + LQ.W && y + h > camY && y < camY + LQ.H;
    for (const o of m.objects) {
      if (o.kind === 'building') {
        const b = o.b, x = b.x * 16, y = (b.y + b.h) * 16 - o.sprite.height;
        if (inView(x, y, o.sprite.width, o.sprite.height)) draws.push({ y: o.sortY, fn: () => ctx.drawImage(o.sprite, x - camX, y - camY) });
      } else if (o.kind === 'carillon') {
        const x = o.x, y = o.y - o.sprite.height;
        if (inView(x, y, o.sprite.width, o.sprite.height)) draws.push({ y: o.sortY, fn: () => ctx.drawImage(o.sprite, x - camX, y - camY) });
      } else if (o.kind === 'sign') {
        if (inView(o.x, o.y, 16, 10)) draws.push({ y: o.sortY, fn: () => ctx.drawImage(o.sprite, o.x - camX, o.y - camY) });
      } else if (o.kind === 'furn') {
        const f = o.f, x = f.x * 16, y = (f.y + f.h) * 16 - o.sprite.height;
        if (inView(x, y, o.sprite.width, o.sprite.height)) draws.push({ y: o.sortY, fn: () => ctx.drawImage(o.sprite, x - camX, y - camY) });
      }
    }
    if (this.phone) {
      const spr = this.phoneSprite || (this.phoneSprite = LQ.makePhoneSprite());
      const x = this.phone.x * 16, y = this.phone.y * 16;
      draws.push({ y: y + 16, fn: () => ctx.drawImage(spr, x - camX, y + 2 - camY) });
    }
    if (m.treeRows.length) {
      const trees = LQ.getTreeSprites();
      for (let y = Math.max(0, ty0 - 1); y <= Math.min(m.h - 1, ty1 + 2); y++)
        for (const tr of m.treeRows[y] || []) {
          if (tr.x < tx0 - 1 || tr.x > tx1 + 1) continue;
          const spr = trees[tr.v];
          draws.push({ y: (tr.y + 1) * 16 - 2, fn: () => ctx.drawImage(spr, tr.x * 16 - camX, (tr.y + 1) * 16 - spr.height - camY) });
        }
    }
    const shadow = (x, y) => { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x - 5 - camX, y - 2 - camY, 10, 3); };
    for (const n of this.npcs) {
      if (!inView(n.x - 8, n.y - 24, 16, 24)) continue;
      const fr = [0, 1, 0, 2][n.frame || 0];
      const spr = n.sprites[n.dir][fr];
      draws.push({ y: n.y, fn: () => { shadow(n.x, n.y); ctx.drawImage(spr, Math.round(n.x - 8 - camX), Math.round(n.y - 24 - camY)); } });
    }
    for (const e of this.enemies) {
      const spr = e.sprite;
      if (!inView(e.x - spr.width / 2, e.y - spr.height, spr.width, spr.height)) continue;
      if (e.dir > 0 && !e.spriteFlip) e.spriteFlip = LQ.flipSprite(spr);
      const img = e.dir > 0 ? e.spriteFlip : spr;
      const bob = Math.floor(this.t / 10 + e.x) % 2;
      draws.push({ y: e.y, fn: () => {
        shadow(e.x, e.y);
        ctx.drawImage(img, Math.round(e.x - spr.width / 2 - camX), Math.round(e.y - spr.height - bob - camY));
        if (e.mode === 'chase') LQ.drawText(ctx, '!', Math.round(e.x - camX), Math.round(e.y - spr.height - 12 - camY), '#f83030', '#101018');
      } });
    }
    {
      const fr = [0, 1, 0, 2][p.frame];
      const spr = this.playerSprites[p.dir][fr];
      draws.push({ y: p.y + 0.1, fn: () => { shadow(p.x, p.y); ctx.drawImage(spr, Math.round(p.x - 8 - camX), Math.round(p.y - 24 - camY)); } });
    }
    draws.sort((a, b) => a.y - b.y);
    for (const d of draws) d.fn();

    // HUD bits.
    if (this.popup && !this.dialog && !this.menu) {
      const w = LQ.textWidth(this.popup) + 16;
      LQ.drawWindow(ctx, 8, LQ.H - 26, w, 20);
      LQ.drawText(ctx, this.popup, 16, LQ.H - 20, LQ.COLORS.text);
    }
    if (this.areaNameT > 0 && !this.dialog) {
      const w = LQ.textWidth(this.areaName) + 16;
      LQ.drawWindow(ctx, 128 - w / 2, 8, w, 20);
      LQ.drawText(ctx, this.areaName, 136 - w / 2, 14, LQ.COLORS.highlight);
    }
    if (this.dialog) this.drawDialog(ctx);
    if (this.menu) this.drawMenu(ctx);
  }
};
