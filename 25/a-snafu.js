const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const run = () => {
  let lines;

  // runTest();

  if (MANUAL_INPUT) {
    lines = getManualInput();
  } else {
    lines = getLinesFromInputFile();
  }

  const result = implementation(lines);
  console.log(result);
};

const runTest = () => {
  for (let i = 1; i <= 125; i++) {
    console.log(i);
    const snafu = numberToSnafuText(i);
    const result = parseSnafuText(snafu);

    if (result != i) {
      throw new Error(`Got incorrect result for ${i}: ${snafu} => ${result}`);
    }
  }
}

const getManualInput = () => {
  return [
    '1=-0-2',
    '12111',
    '2=0=',
    '21',
    '2=01',
    '111',
    '20012',
    '112',
    '1=-1=',
    '1-12',
    '12',
    '1=',
    '122',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  const total = sum(lines.map((line) => parseSnafuText(line)));
  return numberToSnafuText(total);
};

const parseSnafuText = (text) => {
  const chars = text.split('').reverse();

  let sum = 0;
  for (let i = 0; i < chars.length; i++) {
    sum += getCharValue(chars[i]) * Math.pow(5, i);
  }
  return sum;
};

const getCharValue = (character) => {
  switch (character) {
    case '=':
      return -2;
    case '-':
      return -1;
    case '0':
      return 0;
    case '1':
      return 1;
    case '2':
      return 2;
    default:
      throw new Error(`Unrecognized SNAFU character ${character}`);
  }
};

const numberToSnafuText = (num) => {
  let str = '';
  let exp = 0;
  while (num != 0) {
    if (DEBUG && str != '') {
      console.log(str);
    }
    const powerOf5 = Math.pow(5, exp);
    let digit = num % (powerOf5 * 5);
    if (digit > 2) {
      digit -= 5;
    }
    str = toSnafuChar(digit) + str;
    num -= digit * powerOf5;
    num /= 5;
  }
  return str;
};

const toSnafuChar = (num) => {
  switch (num) {
    case 0:
    case 1:
    case 2:
      return num + '';
    case -1:
      return '-';
    case -2:
      return '=';
    default:
      throw new Error(`Unsupported SNAFU digit conversion for ${num}`);
  }
}

const sum = (arr) => {
  return arr.reduce((soFar, size) => soFar + size, 0);
}

run();