const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const WIDTH = 7;
const MAX_ROCKS = 1000000000000;
// const MAX_ROCKS = 1000000;
// const MAX_ROCKS = 2022;

const INITIAL_ROCKS = MANUAL_INPUT ? 15 : 1725;
const CYCLE_SIZE = MANUAL_INPUT ? 35 : 1715;
const CYCLE_HEIGHT = MANUAL_INPUT ? 53 : 2613;

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
  return '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'.split('');
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('');
};

const implementation = (jets) => {
  const rocks = [
    [[0, 1, 2, 3]],
    [[1], [0, 1, 2], [1]],
    [[0, 1, 2], [2], [2]],
    [[0], [0], [0], [0]],
    [[0, 1], [0, 1]],
  ];

  let currentRockIdx = 0;
  let rock = {parts: rocks[currentRockIdx], dx: 2, dy: 3};

  let jetIdx = 0;

  let tower = {solids: new Map(), height: 0};
  for (let i = 0; i < WIDTH; i++) {
    tower.solids.set(i, new Set());
  }

  while (true) {
    pushRock(rock, jets[jetIdx], tower.solids);
    jetIdx = (jetIdx + 1) % jets.length;

    if (!dropRock(rock, tower.solids)) {
      settleRock(rock, tower);
      currentRockIdx++;
      if (currentRockIdx < MAX_ROCKS) {
        if (currentRockIdx % rocks.length == 0) {
          if (DEBUG && jetIdx < 100) {
            console.log(`After ${currentRockIdx} rocks, jetIdx == ${jetIdx}, height = ${tower.height}`);
          }
          if (currentRockIdx == INITIAL_ROCKS) {
            const cycles = Math.floor((MAX_ROCKS - currentRockIdx) / CYCLE_SIZE);
            const heightOffset = cycles * CYCLE_HEIGHT;
            currentRockIdx += CYCLE_SIZE * cycles;
            raiseTower(tower, heightOffset);
          }
        }
        rock = {parts: rocks[currentRockIdx % rocks.length], dx: 2, dy: tower.height + 3};
      } else {
        return tower.height;
      }
    }
  }
};

const pushRock = (rock, jet, solid) => {
  const dx = jet == '<' ? -1 : 1;

  for (let rockY = 0; rockY < rock.parts.length; rockY++) {
    const rockRow = rock.parts[rockY];
    const absoluteY = rockY + rock.dy;
    for (let rockX = 0; rockX < rockRow.length; rockX++) {
      const absoluteX = rockRow[rockX] + rock.dx + dx;
      if (absoluteX >= WIDTH || absoluteX < 0 || solid.get(absoluteX).has(absoluteY)) {
        return false;
      }
    }
  }

  rock.dx += dx;
  return true;
};

const dropRock = (rock, solid) => {
  for (let rockY = 0; rockY < rock.parts.length; rockY++) {
    const rockRow = rock.parts[rockY];
    const absoluteY = rockY + rock.dy - 1;
    for (let rockX = 0; rockX < rockRow.length; rockX++) {
      const absoluteX = rockRow[rockX] + rock.dx;
      if (absoluteY < 0 || solid.get(absoluteX).has(absoluteY)) {
        return false;
      }
    }
  }

  rock.dy -= 1;
  return true;
};

const settleRock = (rock, tower) => {
  for (let rockY = 0; rockY < rock.parts.length; rockY++) {
    const rockRow = rock.parts[rockY];
    const absoluteY = rockY + rock.dy;
    for (let rockX = 0; rockX < rockRow.length; rockX++) {
      const absoluteX = rockRow[rockX] + rock.dx;
      tower.solids.get(absoluteX).add(absoluteY);
      if (absoluteY + 1 > tower.height) {
        tower.height = absoluteY + 1;
      }
    }
  }
};

const raiseTower = (tower, offset) => {
  for (let x = 0; x < WIDTH; x++) {
    const xSolids = tower.solids.get(x);
    const newXSolids = new Set();
    for (const y of xSolids) {
      newXSolids.add(y + offset);
    }
    tower.solids.set(x, newXSolids);
  }
  tower.height += offset;
};

const min = (arr) => {
  return arr.reduce((soFar, lastMin) => Math.min(soFar, lastMin), Number.MAX_SAFE_INTEGER);
};

const max = (arr) => {
  return arr.reduce((soFar, lastMax) => Math.max(soFar, lastMax), 0);
};

const sum = (arr) => {
  return arr.reduce((soFar, size) => soFar + size, 0);
};

run();