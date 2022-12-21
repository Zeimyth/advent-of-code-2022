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
    'root: pppw + sjmn',
    'dbpl: 5',
    'cczh: sllz + lgvd',
    'zczc: 2',
    'ptdq: humn - dvpt',
    'dvpt: 3',
    'lfqf: 4',
    'humn: 5',
    'ljgn: 2',
    'sjmn: drzm * dbpl',
    'sllz: 4',
    'pppw: cczh / lfqf',
    'lgvd: ljgn * ptdq',
    'drzm: hmdt - zczc',
    'hmdt: 32',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  const monkeys = new Map();

  const numberRegex = /(\w{4}): (\d+)/;
  const mathRegex = /(\w{4}): (\w{4}) ([+\-*/]) (\w{4})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mathMatch = line.match(mathRegex);
    const numberMatch = line.match(numberRegex);

    if (mathMatch !== null) {
      const [_, id, left, op, right] = mathMatch;
      let operation;
      if (op == '+') {
        operation = () => monkeys.get(left).result() + monkeys.get(right).result();
      } else if (op == '-') {
        operation = () => monkeys.get(left).result() - monkeys.get(right).result();
      } else if (op == '*') {
        operation = () => monkeys.get(left).result() * monkeys.get(right).result();
      } else if (op == '/') {
        operation = () => monkeys.get(left).result() / monkeys.get(right).result();
      }

      let cache = undefined;
      monkeys.set(id, {
        id,
        result: () => {
          if (cache === undefined) {
            cache = operation();
          }
          
          return cache;
        }
      });
    } else {
      const [_, id, rawNumber] = numberMatch;
      const number = parseInt(rawNumber);

      monkeys.set(id, {
        id,
        result: () => number,
      });
    }
  }

  return monkeys.get('root').result();
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