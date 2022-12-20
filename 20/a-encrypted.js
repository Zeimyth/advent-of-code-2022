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
    '1',
    '2',
    '-3',
    '3',
    '-2',
    '0',
    '4',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  const ring = [];
  let head;
  for (let i = 0; i < lines.length; i++) {
    const num = parseInt(lines[i]);
    const data = {value: num, idx: i};
    ring.push(data);
    if (num == 0) {
      head = i;
    }
  }

  for (let i = 0; i < ring.length; i++) {
    const data = ring.find((d) => d.idx == i);
    rotate(ring, i, data.value);
    if (DEBUG) {
      console.log(`After moving ${data.value}, ring list is ${JSON.stringify(ring.map(d => d.value))}`);
    }
  }

  const headIndex = ring.findIndex(d => d.value == 0);

  return ring[safeMod((headIndex + 1000), ring.length)].value + ring[safeMod((headIndex + 2000), ring.length)].value + ring[safeMod((headIndex + 3000), ring.length)].value;
};

const rotate = (ring, idx, amount) => {
  let dataIndex = ring.findIndex(d => d.idx == idx);
  const data = ring[dataIndex];
  const n = Math.abs(amount);
  let shift;
  if (amount < 0) {
    shift = -1;
  } else if (amount > 0) {
    shift = 1;
  } else {
    return;
  }

  for (let i = 0; i < n; i++) {
    const targetIndex = safeMod(dataIndex + shift, ring.length);
    const target = ring[targetIndex];
    ring[dataIndex] = target;
    ring[targetIndex] = data;
    dataIndex = targetIndex;
  }
};

const safeMod = (n, m) => (((n % m) + m) % m);

run();