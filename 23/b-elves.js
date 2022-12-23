const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const NORTH = 0;
const SOUTH = 1;
const WEST = 2;
const EAST = 3;
const DIRECTIONS = [NORTH, SOUTH, WEST, EAST];

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
    '....#..',
    '..###.#',
    '#...#.#',
    '.#...##',
    '#.###..',
    '##.#.##',
    '.#..#..',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  let [elves, totalElves] = parse(lines);

  if (DEBUG) {
    printState(elves);
  }

  for (let round = 0; true; round++) {
  // for (let round = 0; round < 1; round++) {
    const [movedElves, elfMoved] = step(elves);
    if (elfMoved === false) {
      return round + 1;
    } else {
      elves = movedElves;
      if (DEBUG) {
        printState(elves);
      }
    }
  }
};

const parse = (lines) => {
  let totalElves = 0;
  const elves = new Map();
  for (let y = 0; y < lines.length; y++) {
    const lineSet = new Set();
    const line = lines[y].split('');
    for (let x = 0; x < line.length; x++) {
      if (line[x] == '#') {
        lineSet.add(x);
        totalElves++;
      }
    }
    elves.set(y, lineSet);
  }

  return [elves, totalElves];
};

const step = (elves) => {
  const [proposedDirections, potentialEntrants] = calculateProposedDirections(elves);
  const [movedElves, elfMoved] = moveElves(elves, proposedDirections, potentialEntrants);
  cycleDirections();
  return [movedElves, elfMoved];
};

const calculateProposedDirections = (elves) => {
  const proposedDirections = new Map();
  const potentialEntrants = new Map();
  for (const y of elves.keys()) {
    const directionsRow = new Map();
    for (const x of elves.get(y).values()) {
      if (hasNeighbor(elves, x, y)) {
        const proposedDirection = getProposedDirection(elves, x, y);
        if (proposedDirection !== undefined) {
          if (DEBUG) {
            const d = proposedDirection == NORTH ? 'N' : proposedDirection == SOUTH ? 'S' : proposedDirection == WEST ? 'W' : 'E';
            console.log(`Elf (${x}, ${y}) proposes to move ${d}.`);
          }
          directionsRow.set(x, proposedDirection)
          updateEntrantsMap(potentialEntrants, x, y, proposedDirection);
        } else {
          if (DEBUG) {
            console.log(`Elf (${x}, ${y}) has no legal moves.`);
          }
        }
      } else {
        if (DEBUG) {
          console.log(`Elf (${x}, ${y}) has no neighbors and will not move.`);
        }
      }
    }
    proposedDirections.set(y, directionsRow);
  }

  return [proposedDirections, potentialEntrants];
}

const hasNeighbor = (elves, x, y) => {
  for (let dy = -1; dy < 2; dy++) {
    const row = elves.get(y + dy);
    if (row === undefined) {
      continue;
    }

    for (let dx = -1; dx < 2; dx++) {
      if (dy == 0 && dx == 0) {
        // Don't count yourself as a neighbor
        continue;
      } else if (row.has(x + dx)) {
        return true;
      }
    }
  }

  return false;
};

const getProposedDirection = (elves, x, y) => {
  for (let dirIdx = 0; dirIdx < DIRECTIONS.length; dirIdx++) {
    const dir = DIRECTIONS[dirIdx];
    if (dir == NORTH) {
      if (!elves.has(y - 1) || (!elves.get(y - 1).has(x - 1) && !elves.get(y - 1).has(x) && !elves.get(y - 1).has(x + 1))) {
        return NORTH;
      }
    } else if (dir == SOUTH) {
      if (!elves.has(y + 1) || (!elves.get(y + 1).has(x - 1) && !elves.get(y + 1).has(x) && !elves.get(y + 1).has(x + 1))) {
        return SOUTH;
      }
    } else if (dir == WEST) {
      if ((!elves.has(y - 1) || !elves.get(y - 1).has(x - 1)) && !elves.get(y).has(x - 1) && (!elves.has(y + 1) || !elves.get(y + 1).has(x - 1))) {
        return WEST;
      }
    } else if (dir == EAST) {
      if ((!elves.has(y - 1) || !elves.get(y - 1).has(x + 1)) && !elves.get(y).has(x + 1) && (!elves.has(y + 1) || !elves.get(y + 1).has(x + 1))) {
        return EAST;
      }
    }
  }
};

const updateEntrantsMap = (potentialEntrants, x, y, dir) => {
  let newX = x;
  let newY = y;
  if (dir === NORTH) {
    newY -= 1;
  } else if (dir === SOUTH) {
    newY += 1;
  } else if (dir === WEST) {
    newX -= 1;
  } else if (dir === EAST) {
    newX += 1;
  }

  if (!potentialEntrants.has(newY)) {
    potentialEntrants.set(newY, new Map());
  }
  if (!potentialEntrants.get(newY).has(newX)) {
    potentialEntrants.get(newY).set(newX, 1);
  } else {
    potentialEntrants.get(newY).set(newX, potentialEntrants.get(newY).get(newX) + 1);
  }
};

const moveElves = (elves, proposedDirections, potentialEntrants) => {
  const movedElves = new Map();
  let elfMoved = false;

  for (y of elves.keys()) {
    for (x of elves.get(y).values()) {
      const direction = proposedDirections.has(y) && proposedDirections.get(y).has(x) && proposedDirections.get(y).get(x);
      if (direction === false) {
        if (!movedElves.has(y)) {
          movedElves.set(y, new Set());
        }
        movedElves.get(y).add(x);
      } else {
        const moved = tryMove(movedElves, potentialEntrants, x, y, direction);
        if (moved) {
          elfMoved = true;
        }
      }
    }
  }

  return [movedElves, elfMoved];
};

const tryMove = (movedElves, potentialEntrants, x, y, dir) => {
  let newX = x;
  let newY = y;
  let moved = true;

  if (dir === NORTH) {
    newY -= 1;
  } else if (dir === SOUTH) {
    newY += 1;
  } else if (dir === WEST) {
    newX -= 1;
  } else if (dir === EAST) {
    newX += 1;
  }

  if (potentialEntrants.get(newY).get(newX) != 1) {
    newX = x;
    newY = y;
    moved = false;
  }
  
  if (!movedElves.has(newY)) {
    movedElves.set(newY, new Set());
  }
  movedElves.get(newY).add(newX);
  return moved;
}

const cycleDirections = () => {
  const first = DIRECTIONS[0];
  DIRECTIONS[0] = DIRECTIONS[1];
  DIRECTIONS[1] = DIRECTIONS[2];
  DIRECTIONS[2] = DIRECTIONS[3];
  DIRECTIONS[3] = first;
};

const getEmptySpaces = (elves, totalElves) => {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  for (const y of elves.keys()) {
    if (y > maxY) {
      maxY = y;
    }
    if (y < minY) {
      minY = y;
    }

    for (const x of elves.get(y).values()) {
      if (x > maxX) {
        maxX = x;
      }
      if (x < minX) {
        minX = x;
      }
    }
  }

  return (maxX - minX + 1) * (maxY - minY + 1) - totalElves;
};

const printState = (elves) => {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  for (const y of elves.keys()) {
    if (y > maxY) {
      maxY = y;
    }
    if (y < minY) {
      minY = y;
    }

    for (const x of elves.get(y).values()) {
      if (x > maxX) {
        maxX = x;
      }
      if (x < minX) {
        minX = x;
      }
    }
  }

  for (let y = minY; y <= maxY; y++) {
    let str = '';
    for (let x = minX; x <= maxX; x++) {
      if (!elves.has(y) || !elves.get(y).has(x)) {
        str += '.';
      } else {
        str += '#';
      }
    }
    console.log(str);
  }

  console.log('\n');
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

const mult = (arr) => {
  return arr.reduce((soFar, size) => soFar * size, 1);
};

run();