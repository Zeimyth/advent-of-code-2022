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
    '30373',
    '25512',
    '65332',
    '33549',
    '35390',
  ];
}

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
}

const implementation = (lines) => {
  const heights = lines.map(line => line.split('').map(n => parseInt(n)));
  const width = heights[0].length;
  const height = heights.length;

  let greatestScore = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const score = getTreeScore(x, y, heights, width, height);
      if (DEBUG) {
        console.log(`Tree at (${x},${y}) has a score of ${score}`);
      }
      if (score > greatestScore) {
        greatestScore = score;
      }
    }
  }

  return greatestScore;
};

const getTreeScore = (x, y, heights, width, height) => {
  const target = heights[y][x];
  let left = 0;
  let right = 0;
  let up = 0;
  let down = 0;

  for (let dx = x - 1; dx >= 0; dx--) {
    left++;

    if (heights[y][dx] >= target) {
      break;
    }
  }

  for (let dx = x + 1; dx < width; dx++) {
    right++;

    if (heights[y][dx] >= target) {
      break;
    }
  }

  for (let dy = y - 1; dy >= 0; dy--) {
    up++;

    if (heights[dy][x] >= target) {
      break;
    }
  }

  for (let dy = y + 1; dy < height; dy++) {
    down++;

    if (heights[dy][x] >= target) {
      break;
    }
  }

  if (DEBUG) {
    console.log(`Left ${left} Right ${right} Up ${up} Down ${down}`)
  }
  return left * right * up * down;
};

run();