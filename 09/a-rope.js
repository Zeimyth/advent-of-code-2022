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
    'R 4',
    'U 4',
    'L 3',
    'D 1',
    'R 4',
    'D 1',
    'L 5',
    'R 2',
  ];
}

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
}

const implementation = (lines) => {
  let head = {x: 0, y: 0};
  let tail = {x: 0, y: 0};

  const visited = new Map();
  visited.set(0, new Set([0]));

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (DEBUG) {
      console.log(line);
    }
    const [dir, rawSteps] = line.split(' ');
    const steps = parseInt(rawSteps);

    let dx = 0;
    let dy = 0;

    if (dir == 'R') {
      dx = 1;
    } else if (dir == 'U') {
      dy = 1;
    } else if (dir == 'L') {
      dx = -1;
    } else if (dir == 'D') {
      dy = -1;
    }

    for (let step = 0; step < steps; step++) {
      head.x += dx;
      head.y += dy;
      dragTail(head, tail, visited);
      if (DEBUG) {
        console.log(`Tail has visited ${sum(Array.from(visited.values()).map(v => v.size))} cells`);
      }
    }
  }

  return sum(Array.from(visited.values()).map(v => v.size));
};

const dragTail = (head, tail, visited) => {
  const distanceX = head.x - tail.x;
  const distanceY = head.y - tail.y;

  if (Math.abs(distanceX) >= 2 || Math.abs(distanceY) >= 2) {
    tail.x += (distanceX > 0 ? 1 : (distanceX < 0 ? -1 : 0));
    tail.y += (distanceY > 0 ? 1 : (distanceY < 0 ? -1 : 0));
    if (DEBUG) {
      console.log(`Tail dragged to (${tail.x},${tail.y})`);
    }

    if (!visited.has(tail.y)) {
      visited.set(tail.y, new Set());
    }

    visited.get(tail.y).add(tail.x);
  }
};

const sum = (arr) => {
  return arr.reduce((soFar, size) => soFar + size, 0);
}

run();