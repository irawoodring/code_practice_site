// The Allendale campus, in 16px tiles. One tile is roughly 12 meters.
// +x is EAST, +y is SOUTH.
//
// Layout notes (what this map is trying to get right):
//   * Lake Michigan Drive (M-45) runs along the NORTH edge of campus.
//     The main entrance turns south off M-45 onto North Campus Drive.
//   * The Grand River is to the EAST, with wooded ravines dropping down to it.
//   * Athletics (Fieldhouse, Kelly Family Sports Center, Lubbers Stadium) are on
//     the WEST side, next to the golf course. 48th Avenue and the village of
//     Allendale are farther west.
//   * Student housing sits at the NORTH and SOUTH ends; academics in the middle.
//   * West Campus Drive splits north and south campus.
//   * Mary Idema Pew Library is at Campus Drive & West Campus Drive, next door
//     to the Kirkhof Center, near the Cook Carillon and Zumberge Pond.
//   * Little Mac Bridge crosses a ravine between Henry Hall and Great Lakes Plaza.
//
// Exact building footprints are approximate. To fix a spot, edit the numbers
// below; everything else (paths, signs, the map screen) follows automatically.
window.LQ = window.LQ || {};

LQ.CAMPUS = {
  width: 150,
  height: 160,

  // Roads: {x, y, w, h}. Orientation is inferred from the shape.
  roads: [
    { name: 'Lake Michigan Dr (M-45)', x: 0, y: 6, w: 150, h: 4 },
    { name: '48th Ave', x: 20, y: 0, w: 4, h: 160 },
    { name: 'Stadium Dr', x: 34, y: 10, w: 4, h: 68 },
    { name: 'North Campus Dr', x: 76, y: 10, w: 4, h: 60 },
    { name: 'North Campus Dr', x: 59, y: 66, w: 21, h: 4 },
    { name: 'Campus Dr', x: 59, y: 66, w: 4, h: 75 },
    { name: 'West Campus Dr', x: 24, y: 78, w: 35, h: 4 },
    { name: 'South Campus Dr', x: 59, y: 137, w: 54, h: 4 },
    { name: 'Calder Dr', x: 109, y: 90, w: 4, h: 51 },
    { name: 'Pierce St', x: 0, y: 152, w: 136, h: 4 },
  ],

  parking: [
    { name: 'Fieldhouse lots', x: 39, y: 12, w: 18, h: 8 },
    { name: 'Lot by Kirkhof', x: 48, y: 86, w: 10, h: 12 },
    { name: 'South lots', x: 40, y: 112, w: 18, h: 20 },
    { name: 'North housing lot', x: 112, y: 12, w: 10, h: 8 },
    { name: 'Calder lot', x: 114, y: 120, w: 10, h: 12 },
  ],

  // Brick plazas and big walkways.
  plazas: [
    { name: 'Great Lakes Plaza', x: 82, y: 62, w: 40, h: 17 },
    { name: 'Carillon Plaza', x: 76, y: 76, w: 7, h: 12 },
    { name: 'Kirkhof Plaza', x: 63, y: 82, w: 15, h: 5 },
  ],

  // Sidewalks / trails: {x, y, w, h} (dirt: true for ravine trails).
  paths: [
    { x: 95, y: 30, w: 2, h: 14 },     // north housing -> Henry Hall
    { x: 95, y: 62, w: 2, h: 56 },     // Great Lakes Plaza -> south housing
    { x: 77, y: 70, w: 2, h: 30 },     // library/carillon walk
    { x: 63, y: 93, w: 46, h: 2 },     // Kirkhof -> Calder Dr
    { x: 63, y: 101, w: 46, h: 2 },    // GVA walk
    { x: 63, y: 115, w: 46, h: 2 },    // south housing walk
    { x: 80, y: 30, w: 30, h: 2 },     // Kleiner walk
    { x: 82, y: 40, w: 38, h: 2 },     // science walk
    { x: 24, y: 44, w: 10, h: 2 },     // golf course crossing
    { x: 113, y: 100, w: 22, h: 1, dirt: true },  // ravine trail
    { x: 122, y: 66, w: 14, h: 1, dirt: true },
    { x: 125, y: 24, w: 1, h: 30, dirt: true },
  ],

  fields: [
    { kind: 'turf', name: 'Lubbers Stadium', x: 41, y: 48, w: 14, h: 20, stands: true },
    { kind: 'turf', name: 'Intramural fields', x: 26, y: 86, w: 20, h: 22 },
    { kind: 'fairway', name: 'The Meadows golf course', x: 24, y: 12, w: 10, h: 64 },
    { kind: 'farm', name: 'Farm fields', x: 0, y: 142, w: 150, h: 10 },
    { kind: 'farm', name: 'Farm fields', x: 0, y: 156, w: 150, h: 4 },
    { kind: 'farm', name: 'Farm fields', x: 0, y: 44, w: 19, h: 30 },
  ],

  pond: { name: 'Zumberge Pond', cx: 89, cy: 86, rx: 6, ry: 4 },

  // The Grand River: x position of the west bank per row is computed with a
  // gentle wobble around this value.
  river: { x: 136, w: 6 },

  // Ravines are bands of steep wooded ground. Bridges cut across them.
  ravines: [
    { name: 'Ravine', x: 82, y: 54, w: 54, h: 7 },
    { name: 'Ravine', x: 116, y: 104, w: 20, h: 8 },
    { name: 'River ravines', x: 124, y: 20, w: 12, h: 120, sparse: true },
  ],
  bridges: [
    { name: 'Little Mac Bridge', x: 95, y: 54, w: 2, h: 7 },
  ],

  // Wooded areas (dense trees).
  woods: [
    { x: 142, y: 0, w: 8, h: 160 },
    { x: 116, y: 80, w: 8, h: 56 },
    { x: 0, y: 76, w: 19, h: 64 },
  ],

  // Buildings. door: column offset from the left edge (default: middle),
  // door is on the south face. interior: id of an enterable interior.
  buildings: [
    // North housing (near M-45)
    { id: 'frey', name: 'Frey Living Center', x: 82, y: 13, w: 8, h: 6, style: 'brick', interior: 'frey' },
    { id: 'hills', name: 'Hills Living Center', x: 92, y: 13, w: 8, h: 6, style: 'brick' },
    { id: 'northc', name: 'North C Living Center', x: 102, y: 13, w: 8, h: 6, style: 'brick' },
    { id: 'kleiner', name: 'Kleiner Commons', x: 84, y: 22, w: 9, h: 6, style: 'modern', interior: 'kleiner' },
    { id: 'townhomes', name: 'North Campus Townhomes', x: 97, y: 22, w: 13, h: 5, style: 'brick' },
    { id: 'alumni', name: 'Alumni House & Visitor Center', x: 66, y: 12, w: 8, h: 5, style: 'stone', interior: 'alumni' },

    // Athletics (west)
    { id: 'fieldhouse', name: 'Fieldhouse & Recreation Center', x: 40, y: 22, w: 16, h: 10, style: 'modern', interior: 'fieldhouse' },
    { id: 'kelly', name: 'Kelly Family Sports Center', x: 40, y: 34, w: 12, h: 7, style: 'modern' },

    // North academic (north of the ravine)
    { id: 'mackinac', name: 'Mackinac Hall', x: 82, y: 44, w: 9, h: 8, style: 'brick' },
    { id: 'henry', name: 'Henry Hall', x: 92, y: 44, w: 8, h: 8, style: 'brick', door: 4 },
    { id: 'padnos', name: 'Padnos Hall of Science', x: 101, y: 42, w: 10, h: 9, style: 'stone', interior: 'padnos' },
    { id: 'kindschi', name: 'Kindschi Hall of Science', x: 112, y: 42, w: 8, h: 8, style: 'glass' },

    // Great Lakes Plaza (south of the ravine)
    { id: 'lmh', name: 'Lake Michigan Hall', x: 84, y: 64, w: 8, h: 6, style: 'brick' },
    { id: 'lsh', name: 'Lake Superior Hall', x: 98, y: 64, w: 7, h: 6, style: 'brick' },
    { id: 'lhh', name: 'Lake Huron Hall', x: 106, y: 64, w: 7, h: 6, style: 'brick' },
    { id: 'loh', name: 'Lake Ontario Hall', x: 114, y: 64, w: 7, h: 6, style: 'brick' },
    { id: 'ausable', name: 'Au Sable Hall', x: 84, y: 72, w: 8, h: 5, style: 'brick' },
    { id: 'manitou', name: 'Manitou Hall', x: 106, y: 72, w: 7, h: 5, style: 'brick' },

    // Core
    { id: 'library', name: 'Mary Idema Pew Library', x: 64, y: 71, w: 12, h: 9, style: 'glass', interior: 'library' },
    { id: 'kirkhof', name: 'Kirkhof Center', x: 64, y: 87, w: 13, h: 6, style: 'brick', interior: 'kirkhof' },
    { id: 'zumberge', name: 'Zumberge Hall', x: 98, y: 82, w: 9, h: 7, style: 'stone', interior: 'zumberge' },
    { id: 'calder', name: 'Calder Art Center', x: 85, y: 95, w: 9, h: 5, style: 'modern' },
    { id: 'pac', name: 'Performing Arts Center', x: 97, y: 95, w: 10, h: 5, style: 'glass' },

    // South housing
    { id: 'niemeyer', name: 'Niemeyer Living Center', x: 46, y: 100, w: 10, h: 6, style: 'brick' },
    { id: 'gva1', name: 'Grand Valley Apartments', x: 64, y: 104, w: 11, h: 6, style: 'brick' },
    { id: 'gva2', name: 'Grand Valley Apartments', x: 78, y: 104, w: 10, h: 6, style: 'brick' },
    { id: 'copeland', name: 'Copeland Living Center', x: 64, y: 119, w: 8, h: 7, style: 'brick' },
    { id: 'kirkpatrick', name: 'Kirkpatrick Living Center', x: 74, y: 119, w: 8, h: 7, style: 'brick' },
    { id: 'robinson', name: 'Robinson Living Center', x: 88, y: 119, w: 8, h: 7, style: 'brick' },
    { id: 'swanson', name: 'Swanson Living Center', x: 98, y: 119, w: 8, h: 7, style: 'brick' },

    // Allendale (west of 48th Ave, along M-45)
    { id: 'twphall', name: 'Allendale Township Hall', x: 4, y: 12, w: 8, h: 5, style: 'stone' },
    { id: 'house1', name: 'A house', x: 3, y: 20, w: 5, h: 4, style: 'house' },
    { id: 'house2', name: 'A house', x: 11, y: 20, w: 5, h: 4, style: 'house' },
    { id: 'diner', name: 'Allendale Corner Diner', x: 4, y: 28, w: 9, h: 5, style: 'shop', interior: 'diner' },
    { id: 'house3', name: 'A house', x: 3, y: 36, w: 5, h: 4, style: 'house' },
    { id: 'house4', name: 'A house', x: 11, y: 36, w: 5, h: 4, style: 'house' },
  ],

  // Special landmarks drawn as tall objects.
  carillon: { name: 'Cook Carillon Tower', x: 79, y: 80, w: 2, h: 2 },
  stadiumStands: [
    { x: 39, y: 48, w: 2, h: 20 },
    { x: 55, y: 48, w: 2, h: 20 },
  ],

  // Road / place signs: text shown when checked.
  signs: [
    { x: 74, y: 11, text: 'GRAND VALLEY STATE UNIVERSITY\nAllendale Campus. Founded 1960.\nWelcome, Lakers!' },
    { x: 25, y: 11, text: 'West: Allendale. East: Grand Valley State University.\nNorth/South: 48th Avenue.' },
    { x: 133, y: 11, text: 'East on M-45: the Grand River bridge, then Standale and Grand Rapids.' },
    { x: 63, y: 77, text: 'Intersection of Campus Drive and West Campus Drive.\nMary Idema Pew Library is right here.' },
    { x: 97, y: 52, text: 'Little Mac Bridge.\nIt spans the ravine between Henry Hall and Great Lakes Plaza.' },
    { x: 92, y: 81, text: 'Zumberge Pond.\nThe geese consider this their pond. You are a guest.' },
    { x: 57, y: 47, text: 'Arend D. Lubbers Stadium.\nHome of Laker football.' },
    { x: 34, y: 82, text: 'Intramural fields. West Campus Drive continues to 48th Ave.' },
    { x: 108, y: 136, text: 'South Campus Drive. Farm fields to the south, Pierce Street beyond.' },
    { x: 123, y: 99, text: 'Ravine trail. The Grand River is just east of here.' },
  ],

  // Labels for the overview map (abbreviation shown on the map).
  mapLabels: [
    // dx/dy: label offset from the building's top-left corner, in map pixels.
    { abbr: 'LIB', ref: 'library', dx: -2, dy: 1 },
    { abbr: 'KIR', ref: 'kirkhof', dx: -2, dy: 0 },
    { abbr: 'ZUM', ref: 'zumberge', dx: 0, dy: -1 },
    { abbr: 'FH', ref: 'fieldhouse', dx: 3, dy: 1 },
    { abbr: 'KLN', ref: 'kleiner', dx: -4, dy: -1 },
    { abbr: 'PAD', ref: 'padnos', dx: -2, dy: 0 },
    { abbr: 'GLP', ref: 'lsh', dx: -8, dy: 2 },
  ],
};
