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

  const result = implementation(lines[0]);
  console.log(result);
};

const getManualInput = () => {
  return ['mjqjpqmgbljsphdztnvjfqwrcgsmlb'];
  // return ['bvwbjplbgvbhsrlpgdmjqwftvncz'];
  // return ['nppdvjthqldpwncqszvftbrmjlhg'];
  // return ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'];
}

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
}

const implementation = (line) => {
  const size = 14;
  for (let i = 0; i < line.length - size; i++) {
    const substring = line.substring(i, i + size);
    const unique = new Set(substring.split(''));
    if (unique.size == size) {
      return i + size;
    }
  }
}

run();