const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const WIDTH = 7;
const MAX_ROCKS = 2022;

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
        rock = {parts: rocks[currentRockIdx % rocks.length], dx: 2, dy: tower.height + 3};
      } else {
        if (DEBUG) {
          printState(tower);
        }
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

const printState = (tower) => {
  for (let y = tower.height; y >= 0; y--) {
    let str = '|';
    for (let x = 0; x < WIDTH; x++) {
      if (tower.solids.get(x).has(y)) {
        str += '#';
      } else {
        str += ' ';
      }
    }
    str += '|';
    console.log(str);
  }
  console.log('+-------+');
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