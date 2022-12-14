const { execSync } = require('child_process');
const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const run = () => {
  let lines;

  if (MANUAL_INPUT) {
    lines = getManualInput();
  } else {
    lines = getLinesFromInputFile();
  }

  const result = implementation(lines);
  console.log(result);
};

const getManualInput = () => {
  return [
    '498,4 -> 498,6 -> 496,6',
    '503,4 -> 502,4 -> 502,9 -> 494,9',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  const solid = new Map();
  drawWalls(lines, solid);

  return dropSand(solid);
};

const drawWalls = (lines, solid) => {
  for (let i = 0; i < lines.length; i++) {
    const coords = lines[i].split(' -> ').map(coord => coord.split(',').map(n => parseInt(n)));
    for (let c = 0; c < coords.length - 1; c++) {
      const start = coords[c];
      const end = coords[c + 1];

      if (start[0] < end[0]) {
        drawHorizontalWall(start, end, solid);
      } else if (start[0] > end[0]) {
        drawHorizontalWall(end, start, solid);
      } else if (start[1] < end[1]) {
        drawVerticalWall(start, end, solid);
      } else if (start[1] > end[1]) {
        drawVerticalWall(end, start, solid);
      } else {
        drawSinglePoint(start, solid);
      }
    }
  }
};

const drawHorizontalWall = (start, end, solid) => {
  if (start[1] != end[1]) {
    throw new Error('Wall isn\'t horizontal!');
  } else if (start[0] > end[0]) {
    throw new Error('Wall is backwards!');
  }

  const y = start[1];
  for (let x = start[0]; x <= end[0]; x++) {
    if (!solid.has(y)) {
      solid.set(y, new Set());
    }

    solid.get(y).add(x);
  }
};

const drawVerticalWall = (start, end, solid) => {
  if (start[0] != end[0]) {
    throw new Error('Wall isn\'t vertical!');
  } else if (start[1] > end[1]) {
    throw new Error('Wall is backwards!');
  }

  const x = start[0];
  for (let y = start[1]; y <= end[1]; y++) {
    if (!solid.has(y)) {
      solid.set(y, new Set());
    }

    solid.get(y).add(x);
  }
};

const drawSinglePoint = (coord, solid) => {
  const x = coord[0];
  const y = coord[1];
  
  if (!solid.has(y)) {
    solid.set(y, new Set());
  }

  solid.get(y).add(x);
};

const dropSand = (solid) => {
  const sandSolids = new Map();
  const lowestWall = Array.from(solid.keys()).sort((a, b) => b - a)[0];
  let sand = 0;

  while (true) {
    let x = 500;
    let y = 0;
    let oldX;
    let oldY;

    const drop = () => {
      if (!solid.has(y + 1) || !solid.get(y + 1).has(x)) {
        if (y < lowestWall + 1) {
          y++;
        }
      } else if (!solid.get(y + 1).has(x - 1)) {
        y++;
        x--;
      } else if (!solid.get(y + 1).has(x + 1)) {
        y++;
        x++;
      }
    };

    do {
      oldX = x;
      oldY = y;
      drop();
    } while (x != oldX || y != oldY);

    sand++;
    if (x == 500 && y == 0) {
      render(solid, sandSolids, sand);
      break;
    } else {
      if (!solid.has(y)) {
        solid.set(y, new Set());
      }
      if (!sandSolids.has(y)) {
        sandSolids.set(y, new Set());
      }
      solid.get(y).add(x);
      sandSolids.get(y).add(x);
      if (DEBUG) {
        console.log(`Sand settled at (${x}, ${y}); total = ${sand}`);
      }
    }
  }

  return sand;
};

const render = (solid, sandSolid, sand) => {
  console.log('Sand: ' + sand);
  for (let y = 0; y < 165; y++) {
    let str = '';
    for (let x = 465; x < 565; x++) {
      if (sandSolid.has(y) && sandSolid.get(y).has(x)) {
        str += '.';
      } else if (solid.has(y) && solid.get(y).has(x)) {
        str += '#';
      } else if (x == 500 && y == 0) {
        str += '+'
      } else {
        str += ' ';
      }
    }
    console.log(str);
  }
};

run();