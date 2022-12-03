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
  return lines.map((line) => {
    return findCommonItem(line);
  }).map((common) => {
    return itemToPriority(common);
  }).reduce(sum, 0);
}

const findCommonItem = (line) => {
  const length = line.length;
  const sizeOfSide = length / 2;

  for (let i = 0; i < sizeOfSide; i++) {
    for (let j = 0; j < sizeOfSide; j++) {
      if (line[i] == line[sizeOfSide + j]) {
        if (DEBUG) {
          console.log(`Common item of ${line} is ${line[i]}`);
        }
        return line[i];
      }
    }
  }
}

const itemToPriority = (item) => {
  const code = item.charCodeAt(0);

  if (code < 97) {
    if (DEBUG) {
      console.log(`Code for ${item} is ${code - 27}`)
    }
    return code - 38;
  } else {
    if (DEBUG) {
      console.log(`Code for ${item} is ${code - 96}`)
    }
    return code - 96;
  }
}

const sum = (acc, x) => acc + x;

run();