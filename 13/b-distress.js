const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const LEFT_FIRST = 0;
const RIGHT_FIRST = 1;
const CONTINUE_CHECKING = 2;

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
    '[1,1,3,1,1]',
    '[1,1,5,1,1]',
    '',
    '[[1],[2,3,4]]',
    '[[1],4]',
    '',
    '[9]',
    '[[8,7,6]]',
    '',
    '[[4,4],4,4]',
    '[[4,4],4,4,4]',
    '',
    '[7,7,7,7]',
    '[7,7,7]',
    '',
    '[]',
    '[3]',
    '',
    '[[[]]]',
    '[[]]',
    '',
    '[1,[2,[3,[4,[5,6,7]]]],8,9]',
    '[1,[2,[3,[4,[5,6,0]]]],8,9]',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  const packets = [...lines, '[[2]]', '[[6]]'].filter((line) => line != '').map((line) => JSON.parse(line));
  packets.sort((left, right) => {
    if (compare(left, right) == LEFT_FIRST) {
      return -1;
    } else {
      return 1;
    }
  });

  const two = packets.findIndex((packet) => JSON.stringify(packet) == '[[2]]') + 1;
  const six = packets.findIndex((packet) => JSON.stringify(packet) == '[[6]]') + 1;

  return two * six;
};

const compare = (left, right) => {
  if (typeof left == 'number') {
    if (typeof right == 'number') {
      if (left < right) {
        return LEFT_FIRST;
      } else if (left > right) {
        return RIGHT_FIRST;
      } else {
        return CONTINUE_CHECKING;
      }
    } else {
      return compare([left], right);
    }
  } else {
    if (typeof right == 'number') {
      return compare(left, [right]);
    } else {
      for (let i = 0; i < left.length && i < right.length; i++) {
        const result = compare(left[i], right[i]);
        if (result == LEFT_FIRST || result == RIGHT_FIRST) {
          return result;
        }
      }
      if (left.length < right.length) {
        return LEFT_FIRST;
      } else if (left.length > right.length) {
        return RIGHT_FIRST;
      } else {
        return CONTINUE_CHECKING;
      }
    }
  }
};

run();