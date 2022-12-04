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
    '2-4,6-8',
    '2-3,4-5',
    '5-7,7-9',
    '2-8,3-7',
    '6-6,4-6',
    '2-6,4-8',
  ];
}

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
}

const implementation = (lines) => {
  let overlaps = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [first, second] = line.split(',');
    const [firstStart, firstEnd] = first.split('-').map(n => parseInt(n));
    const [secondStart, secondEnd] = second.split('-').map(n => parseInt(n));

    if ((firstStart <= secondStart && firstEnd >= secondEnd) || (secondStart <= firstStart && secondEnd >= firstEnd)) {
      if (DEBUG) {
        console.log(`Overlap detected in ${line}`);
      }
      overlaps++;
    }
  }

  return overlaps;
}

run();