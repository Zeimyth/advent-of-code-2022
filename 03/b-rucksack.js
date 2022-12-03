const fs = require('fs');

const MANUAL_INPUT = false;
const DEBUG = false;

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
    'vJrwpWtwJgWrhcsFMMfFFhFp',
    'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
    'PmmdzqPrVvPwwTWBwg',
    'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
    'ttgJtRGJQctTZtZT',
    'CrZsJsPPZsGzwwsLwLmpwMDw',
  ];
}

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
}

const implementation = (lines) => {
  const groups = lines.length / 3;
  let sum = 0;
  for (let i = 0; i < groups; i++) {
    const badgePriority = findCommonItem(lines[i * 3], lines[i * 3 + 1], lines[i * 3 + 2]);
    sum += badgePriority;
  }
  
  return sum;
}

const findCommonItem = (bag1, bag2, bag3) => {
  const priority1 = [...bag1].map(itemToPriority).map((n) => parseInt(n)).sort(sortNum);
  const priority2 = [...bag2].map(itemToPriority).map((n) => parseInt(n)).sort(sortNum);
  const priority3 = [...bag3].map(itemToPriority).map((n) => parseInt(n)).sort(sortNum);

  for (let i = 0; i < priority1.length; i++) {
    for (let j = 0; j < priority2.length; j++) {
      if (priority1[i] < priority2[j]) {
        break;
      }

      if (priority1[i] == priority2[j]) {
        for (let k = 0; k < priority3.length; k++) {
          if (priority1[i] < priority3[k]) {
            break;
          }
  
          if (priority1[i] == priority3[k]) {
            if (DEBUG) {
              console.log(`Priority for ${bag1}, ${bag2}, ${bag3} common item is ${priority1[i]}`);
            }
            return priority1[i];
          }
        }
      }
    }
  }

  throw new Error(`Could not find common item for ${bag1}, ${bag2}, ${bag3} (${priority1}, ${priority2}, ${priority3})`);
}

const itemToPriority = (item) => {
  const code = item.charCodeAt(0);

  if (code < 97) {
    return code - 38;
  } else {
    return code - 96;
  }
}

const sortNum = (a, b) => a - b;

run();