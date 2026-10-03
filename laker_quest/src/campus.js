// Campus details layered on top of the traced map (src/campus_map.js).
//
// The ground, roads, lots, fields and building shapes come from GVSU's
// official Allendale campus map via tools/trace_map.py. Positions here are in
// IMAGE PIXELS of that map (the 560x732 version with the A-F / 1-9 grid), so
// you can check any spot against the map. LQ.imgTile converts to tiles.
window.LQ = window.LQ || {};

LQ.imgTile = function (x, y) {
  const [ox, oy] = LQ.CAMPUS_MAP.origin;
  const s = LQ.CAMPUS_MAP.scale;
  return [Math.floor((x - ox) / s), Math.floor((y - oy) / s)];
};
LQ.imgRect = function (x0, y0, x1, y1) {
  const [a, b] = LQ.imgTile(x0, y0);
  const [c, d] = LQ.imgTile(x1, y1);
  return { x: a, y: b, w: c - a, h: d - b };
};

LQ.CAMPUS = {
  // Building id (from the tracer) -> interior id and look.
  interiors: { flc: 'frey', klc: 'kleiner', kc: 'kirkhof', lib: 'library', jhz: 'zumberge', fh: 'fieldhouse', pad: 'padnos', ah: 'alumni' },
  styles: {
    lib: 'glass', khs: 'glass', pac: 'glass', cdc: 'stone', ah: 'stone', jhz: 'stone', sh: 'house',
    fh: 'modern', ktb: 'modern', mpf: 'modern', rac: 'modern', kc: 'modern',
    cub: 'utility', ser: 'utility', mmb: 'utility', ags: 'utility', mur: 'brick',
  },

  // Signs: image coords + text.
  signs: [
    { at: [352, 74], text: 'GRAND VALLEY STATE UNIVERSITY. Allendale Campus. North Campus Drive starts here, off Lake Michigan Drive (M-45).' },
    { at: [228, 72], text: 'West on Lake Michigan Drive: downtown Allendale.' },
    { at: [520, 74], text: 'East on Lake Michigan Drive: the Grand River, then Grand Rapids.' },
    { at: [530, 128], text: 'This way to the Grand River and the Grand Valley Boathouse.' },
    { at: [258, 168], text: 'Arend D. Lubbers Stadium. Home of Laker football.' },
    { at: [196, 210], text: 'The Meadows Golf Course.' },
    { at: [413, 280], text: 'Little Mac Bridge. It crosses the ravine to the Arboretum and Great Lakes Plaza.' },
    { at: [452, 318], text: 'The Arboretum.' },
    { at: [400, 360], text: 'Zumberge Pond. The geese consider this their pond. You are a guest.' },
    { at: [178, 324], text: 'West Campus Drive. 48th Avenue is to the west.' },
    { at: [204, 410], text: 'South Complex: track & lacrosse stadium, soccer stadium, practice fields.' },
    { at: [300, 470], text: 'Laker Village Apartments.' },
    { at: [312, 504], text: 'Pierce Street, along the south edge of campus.' },
    { at: [398, 540], text: '42nd Avenue runs south from here.' },
    { at: [430, 600], text: 'Grand Valley Apartments.' },
  ],

  // Overview map labels: building id + optional offset in map pixels.
  mapLabels: [
    { abbr: 'LIB', ref: 'lib', dx: -19, dy: 0 },
    { abbr: 'KC', ref: 'kc', dx: 0, dy: 9 },
    { abbr: 'JHZ', ref: 'jhz', dx: 4, dy: 9 },
    { abbr: 'ASH', ref: 'ash', dx: 2, dy: -8 },
    { abbr: 'FH', ref: 'fh', dx: 6, dy: 8 },
    { abbr: 'KLC', ref: 'klc', dx: -2, dy: 0 },
    { abbr: 'PAD', ref: 'pad', dx: 2, dy: 2 },
  ],
};
