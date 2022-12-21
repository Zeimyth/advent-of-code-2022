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

  implementation(lines);
};

const getManualInput = () => {
  return [
    'root: pppw = sjmn',
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
  const mathRegex = /(\w{4}): (\w{4}) ([+\-*/=]) (\w{4})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mathMatch = line.match(mathRegex);
    const numberMatch = line.match(numberRegex);

    if (mathMatch !== null) {
      const [_, id, left, op, right] = mathMatch;
      let operation;
      let reverseOperationLeft;
      let reverseOperationRight;
      if (id == 'root') {
        operation = () => { throw new Error('') };
        reverseOperationLeft = (leftSide, _, value) => {
          if (DEBUG) {
            console.log(`humn? = ${value}`);
          }
          monkeys.get(leftSide).unknownValue(value);
        }
        reverseOperationRight = (rightSide, _, value) => {
          if (DEBUG) {
            console.log(`${value} = humn?`);
          }
          monkeys.get(rightSide).unknownValue(value);
        };
      } else if (op == '+') {
        operation = () => monkeys.get(left).knownValue() + monkeys.get(right).knownValue();
        reverseOperationLeft = (leftSide, target, value) => {
          if (DEBUG) {
            console.log(`humn? + ${value} = ${target}; humn? = ${target} - ${value}`);
          }
          monkeys.get(leftSide).unknownValue(target - value);
        };
        reverseOperationRight = (rightSide, target, value) => {
          if (DEBUG) {
            console.log(`${value} + humn? = ${target}; humn? = ${target} - ${value}`);
          }
          monkeys.get(rightSide).unknownValue(target - value);
        };
      } else if (op == '-') {
        operation = () => monkeys.get(left).knownValue() - monkeys.get(right).knownValue();
        reverseOperationLeft = (leftSide, target, value) => {
          if (DEBUG) {
            console.log(`humn? - ${value} = ${target}; humn? = ${target} + ${value}`);
          }
          monkeys.get(leftSide).unknownValue(target + value);
        };
        reverseOperationRight = (rightSide, target, value) => {
          if (DEBUG) {
            console.log(`${value} - humn? = ${target}; humn? = ${value} - ${target}`);
          }
          monkeys.get(rightSide).unknownValue(value - target);
        };
      } else if (op == '*') {
        operation = () => monkeys.get(left).knownValue() * monkeys.get(right).knownValue();
        reverseOperationLeft = (leftSide, target, value) => {
          if (DEBUG) {
            console.log(`humn? * ${value} = ${target}; humn? = ${target} / ${value}`);
          }
          monkeys.get(leftSide).unknownValue(target / value);
        };
        reverseOperationRight = (rightSide, target, value) => {
          if (DEBUG) {
            console.log(`${value} * humn? = ${target}; humn? = ${target} / ${value}`);
          }
          monkeys.get(rightSide).unknownValue(target / value);
        };
      } else if (op == '/') {
        operation = () => monkeys.get(left).knownValue() / monkeys.get(right).knownValue();
        reverseOperationLeft = (leftSide, target, value) => {
          if (DEBUG) {
            console.log(`humn? / ${value} = ${target}; humn? = ${target} * ${value}`);
          }
          monkeys.get(leftSide).unknownValue(target * value);
        };
        reverseOperationRight = (rightSide, target, value) => {
          if (DEBUG) {
            console.log(`${value} / humn? = ${target}; humn? = ${target} / ${value}`);
          }
          monkeys.get(rightSide).unknownValue(value / target);
        };
      }

      monkeys.set(id, {
        isKnown: () => monkeys.get(left).isKnown() && monkeys.get(right).isKnown(),
        knownValue: () => operation(monkeys.get(left).knownValue(), monkeys.get(right).knownValue()),
        unknownValue: (target) => {
          if (DEBUG) {
            console.log(`${id}.unknownValue(${target})`);
          }
          if (monkeys.get(left).isKnown()) {
            return reverseOperationRight(right, target, monkeys.get(left).knownValue());
          } else {
            return reverseOperationLeft(left, target, monkeys.get(right).knownValue());
          }
        },
      });
    } else {
      const [_, id, rawNumber] = numberMatch;
      if (id != 'humn') {
        const number = parseInt(rawNumber);
  
        monkeys.set(id, {
          isKnown: () => true,
          knownValue: () => number,
        });
      } else {
        monkeys.set(id, {
          isKnown: () => false,
          unknownValue: (target) => {
            console.log(target);
          },
        });
      }
    }
  }

  monkeys.get('root').unknownValue(0);
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