const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const RIGHT = 0;
const UP = 1;
const LEFT = 2;
const DOWN = 3;

const HEIGHT = MANUAL_INPUT ? 4 : 35;
const WIDTH = MANUAL_INPUT ? 6 : 100;

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
    '#.######',
    '#>>.<^<#',
    '#.<..<<#',
    '#>v.><>#',
    '#<^v^^>#',
    '######.#',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  const [blizzards, valley] = parse(lines);
  let parties = new Set();
  parties.add(JSON.stringify({x: 0, y: -1}));

  let minute = 0;
  let route = 0;
  while (true) {
    getNextMinuteBlizzards(blizzards, valley);
    let nextMinuteParties = new Set();
    for (const rawParty of parties) {
      const party = JSON.parse(rawParty);
      if (party.y == -1) {
        if (valley.get(0).get(0).contents.size == 0) {
          nextMinuteParties.add(JSON.stringify({x: 0, y: 0}));
        }
        nextMinuteParties.add(JSON.stringify({x: 0, y: -1}));
      } else if (party.y == HEIGHT) {
        if (valley.get(HEIGHT - 1).get(WIDTH - 1).contents.size == 0) {
          nextMinuteParties.add(JSON.stringify({x: WIDTH - 1, y: HEIGHT - 1}));
        }
        nextMinuteParties.add(JSON.stringify({x: WIDTH - 1, y: HEIGHT}));
      } else if (party.x == WIDTH - 1 && party.y == HEIGHT - 1 && (route === 0 || route == 2)) {
        if (route === 0) {
          route = 1;
          nextMinuteParties = new Set();
          nextMinuteParties.add(JSON.stringify({x: WIDTH - 1, y: HEIGHT}));
          break;
        } else {
          return minute + 1;
        }
      } else if (party.x === 0 && party.y === 0 && route == 1) {
        route = 2;
        nextMinuteParties = new Set();
        nextMinuteParties.add(JSON.stringify({x: 0, y: -1}));
        break;
      } else {
        const potentialParties = [];
        potentialParties.push({x: party.x + 1, y: party.y});
        potentialParties.push({x: party.x, y: party.y - 1});
        potentialParties.push({x: party.x - 1, y: party.y});
        potentialParties.push({x: party.x, y: party.y + 1});
        potentialParties.push({x: party.x, y: party.y});

        for (let i = 0; i < potentialParties.length; i++) {
          const potentialParty = potentialParties[i];
          if (
            potentialParty.x >= 0 &&
            potentialParty.x < WIDTH &&
            potentialParty.y >= 0 &&
            potentialParty.y < HEIGHT &&
            valley.get(potentialParty.y).get(potentialParty.x).contents.size == 0
          ) {
            nextMinuteParties.add(JSON.stringify(potentialParty));
          }
        }
      }
    }
    parties = nextMinuteParties;
    minute++;
    if (DEBUG) {
      printValley(blizzards, valley, parties, minute);
    }
  }
};

const getNextMinuteBlizzards = (blizzards, valley) => {
  for (let i = 0; i < blizzards.length; i++) {
    const blizzard = blizzards[i];

    valley.get(blizzard.y).get(blizzard.x).contents.delete(blizzard.id);

    if (blizzard.dir == RIGHT) {
      blizzard.x = safeMod(blizzard.x + 1, WIDTH);
    } else if (blizzard.dir == UP) {
      blizzard.y = safeMod(blizzard.y - 1, HEIGHT);
    } else if (blizzard.dir == LEFT) {
      blizzard.x = safeMod(blizzard.x - 1, WIDTH);
    } else {
      blizzard.y = safeMod(blizzard.y + 1, HEIGHT);
    }

    valley.get(blizzard.y).get(blizzard.x).contents.add(blizzard.id);
  }
};

const parse = (lines) => {
  const blizzards = [];
  const valley = new Map();

  for (let i = 1; i < lines.length - 1; i++) {
    const line = lines[i].split('');
    const y = i - 1;
    const row = new Map();

    for (let j = 1; j < line.length - 1; j++) {
      const point = line[j];
      const x = j - 1;
      const cell = {contents: new Set()};

      if (point != '.') {
        const blizzard = {x, y, dir: undefined, id: blizzards.length};

        if (point == '>') {
          blizzard.dir = RIGHT;
        } else if (point == '^') {
          blizzard.dir = UP;
        } else if (point == '<') {
          blizzard.dir = LEFT;
        } else if (point == 'v') {
          blizzard.dir = DOWN;
        } else {
          throw new Error(`Unknown direction: ${point}`);
        }

        blizzards.push(blizzard);
        cell.contents.add(blizzard.id);
      }
      row.set(x, cell);
    }

    valley.set(y, row);
  }

  return [blizzards, valley];
};

const printValley = (blizzards, valley, parties, minute) => {
  console.log(`==== Minute ${minute} ====`);

  const parsedParties = new Map();
  for (const rawParty of parties) {
    console.log(rawParty);
    const party = JSON.parse(rawParty);
    if (!parsedParties.has(party.y)) {
      parsedParties.set(party.y, new Set);
    }
    parsedParties.get(party.y).add(party.x);
  }

  for (let y = 0; y < HEIGHT; y++) {
    let str = ''
    for (let x = 0; x < WIDTH; x++) {
      if (parsedParties.has(y) && parsedParties.get(y).has(x)) {
        str += 'E';
      } else {
        const cell = Array.from(valley.get(y).get(x).contents);
        if (cell.length == 0) {
          str += '.';
        } else if (cell.length > 1) {
          str += cell.length;
        } else {
          const blizzard = blizzards[cell[0]];
          if (blizzard.dir == RIGHT) {
            str += '>';
          } else if (blizzard.dir == UP) {
            str += '^';
          } else if (blizzard.dir == LEFT) {
            str += '<';
          } else {
            str += 'v';
          }
        }
      }
    }
    console.log(str);
  }
};

const safeMod = (n, m) => (((n % m) + m) % m);

run();