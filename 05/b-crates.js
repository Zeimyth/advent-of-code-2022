const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const run = () => {
  let stacks, lines;

  if (MANUAL_INPUT) {
    [stacks, lines] = getManualInput();
  } else {
    [stacks, lines] = getLinesFromInputFile();
  }

  const result = implementation(stacks, lines);
  console.log(result);
};

const getManualInput = () => {
  const stacks = [
    'ZN'.split(''),
    'MCD'.split(''),
    'P'.split(''),
  ];

  const lines = [
    'move 1 from 2 to 1',
    'move 3 from 1 to 3',
    'move 2 from 2 to 1',
    'move 1 from 1 to 2',
  ];

  return [stacks, lines];
}

const getLinesFromInputFile = () => {
  const lines = fs.readFileSync('./input.txt', 'utf-8').split('\n');

  /**
   *                 [V]     [C]     [M]
   * [V]     [J]     [N]     [H]     [V]
   * [R] [F] [N]     [W]     [Z]     [N]
   * [H] [R] [D]     [Q] [M] [L]     [B]
   * [B] [C] [H] [V] [R] [C] [G]     [R]
   * [G] [G] [F] [S] [D] [H] [B] [R] [S]
   * [D] [N] [S] [D] [H] [G] [J] [J] [G]
   * [W] [J] [L] [J] [S] [P] [F] [S] [L]
   *  1   2   3   4   5   6   7   8   9 
   */

  const stacks = [
    'WDGBHRV'.split(''),
    'JNGCRF'.split(''),
    'LSFHDNJ'.split(''),
    'JDSV'.split(''),
    'SHDRQWNV'.split(''),
    'PGHCM'.split(''),
    'FJBGLZHC'.split(''),
    'SJR'.split(''),
    'LGSRBNVM'.split(''),
  ];

  return [stacks, lines];
}

const implementation = (stacks, lines) => {
  const regex = /move (\d+) from (\d+) to (\d+)/;
  
  for (let i = 0; i < lines.length; i++) {
    if (DEBUG) {
      console.log(`Step ${i}: ${stacks.map((stack) => stack.join(',')).join('\n')}`);
    }
    const [_, rawAmount, rawFrom, rawTo] = lines[i].match(regex);
    const amount = parseInt(rawAmount);
    const from = parseInt(rawFrom) - 1;
    const to = parseInt(rawTo) - 1;

    if (DEBUG) {
      console.log(`Move ${amount} from ${from} to ${to}`);
      console.log(`stacks[${from}].splice(-${amount})`);
    }
    const cut = stacks[from].splice(-1 * amount);
    if (DEBUG) {
      console.log(`Cut [${cut}] from ${stacks[from]}`);
    }
    for (let j = 0; j < cut.length; j++) {
      stacks[to].push(cut[j]);
    }
    if (DEBUG) {
      console.log(`Pushed [${cut}] to ${stacks[to]}`);
    }
  }

  return stacks.map((stack) => stack[stack.length - 1]).join('');
};

run();