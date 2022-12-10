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
    'addx 15',
    'addx -11',
    'addx 6',
    'addx -3',
    'addx 5',
    'addx -1',
    'addx -8',
    'addx 13',
    'addx 4',
    'noop',
    'addx -1',
    'addx 5',
    'addx -1',
    'addx 5',
    'addx -1',
    'addx 5',
    'addx -1',
    'addx 5',
    'addx -1',
    'addx -35',
    'addx 1',
    'addx 24',
    'addx -19',
    'addx 1',
    'addx 16',
    'addx -11',
    'noop',
    'noop',
    'addx 21',
    'addx -15',
    'noop',
    'noop',
    'addx -3',
    'addx 9',
    'addx 1',
    'addx -3',
    'addx 8',
    'addx 1',
    'addx 5',
    'noop',
    'noop',
    'noop',
    'noop',
    'noop',
    'addx -36',
    'noop',
    'addx 1',
    'addx 7',
    'noop',
    'noop',
    'noop',
    'addx 2',
    'addx 6',
    'noop',
    'noop',
    'noop',
    'noop',
    'noop',
    'addx 1',
    'noop',
    'noop',
    'addx 7',
    'addx 1',
    'noop',
    'addx -13',
    'addx 13',
    'addx 7',
    'noop',
    'addx 1',
    'addx -33',
    'noop',
    'noop',
    'noop',
    'addx 2',
    'noop',
    'noop',
    'noop',
    'addx 8',
    'noop',
    'addx -1',
    'addx 2',
    'addx 1',
    'noop',
    'addx 17',
    'addx -9',
    'addx 1',
    'addx 1',
    'addx -3',
    'addx 11',
    'noop',
    'noop',
    'addx 1',
    'noop',
    'addx 1',
    'noop',
    'noop',
    'addx -13',
    'addx -19',
    'addx 1',
    'addx 3',
    'addx 26',
    'addx -30',
    'addx 12',
    'addx -1',
    'addx 3',
    'addx 1',
    'noop',
    'noop',
    'noop',
    'addx -9',
    'addx 18',
    'addx 1',
    'addx 2',
    'noop',
    'noop',
    'addx 9',
    'noop',
    'noop',
    'noop',
    'addx -1',
    'addx 2',
    'addx -37',
    'addx 1',
    'addx 3',
    'noop',
    'addx 15',
    'addx -21',
    'addx 22',
    'addx -6',
    'addx 1',
    'noop',
    'addx 2',
    'addx 1',
    'noop',
    'addx -10',
    'noop',
    'noop',
    'addx 20',
    'addx 1',
    'addx 2',
    'addx 2',
    'addx -6',
    'addx -11',
    'noop',
    'noop',
    'noop',
  ];
}

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
}

const implementation = (lines) => {
  let sum = 0;
  let x = 1;
  let cycle = 0;

  for (let i = 0; i < lines.length; i++) {
    const command = lines[i];
    if (command == 'noop') {
      cycle += 1;
      if (shouldRead(cycle)) {
        if (DEBUG) {
          console.log(`During cycle ${cycle}, X is ${x}`);
        }
        sum += cycle * x;
      }
    } else {
      const add = parseInt(command.split(' ')[1]);
      cycle += 1;
      if (shouldRead(cycle)) {
        if (DEBUG) {
          console.log(`During cycle ${cycle}, X is ${x}`);
        }
        sum += cycle * x;
      }
      cycle += 1;
      if (shouldRead(cycle)) {
        if (DEBUG) {
          console.log(`During cycle ${cycle}, X is ${x}`);
        }
        sum += cycle * x;
      }
      x += add;
    }
  }
  return sum;
};

const shouldRead = (cycle) => {
  return (cycle - 20) % 40 == 0;
};

run();