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
  const heights = lines.map(line => line.split(''));
  const width = heights[0].length;
  const height = heights.length;

  const visible = [];
  let visibleCount = 0;

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      if (x == 0 || y == 0 || x == width - 1 || y == height - 1) {
        visibleCount++;
        row.push(true);
      } else {
        row.push(false);
      }
    }
    visible.push(row);
  }

  for (let y = 1; y < height - 1; y++) {
    // Looking from the left
    let leftMax = heights[y][0];
    for (let x = 1; x < width - 1; x++) {
      const treeHeight = heights[y][x];
      if (treeHeight > leftMax) {
        leftMax = treeHeight;
        if (!visible[y][x]) {
          visibleCount++;
          visible[y][x] = true;
        }
      }
    }

    // Looking from the right
    let rightMax = heights[y][width - 1];
    for (let x = width - 2; x > 0; x--) {
      const treeHeight = heights[y][x];
      if (treeHeight > rightMax) {
        rightMax = treeHeight;
        if (!visible[y][x]) {
          visibleCount++;
          visible[y][x] = true;
        }
      }
    }
  }

  for (let x = 1; x < width - 1; x++) {
    // Looking from the top 
    let topMax = heights[0][x];
    for (let y = 1; y < height - 1; y++) {
      const treeHeight = heights[y][x];
      if (treeHeight > topMax) {
        topMax = treeHeight;
        if (!visible[y][x]) {
          visibleCount++;
          visible[y][x] = true;
        }
      }
    }
    
    // Looking from the bottom 
    let bottomMax = heights[height - 1][x];
    for (let y = height - 2; y > 0; y--) {
      const treeHeight = heights[y][x];
      if (treeHeight > bottomMax) {
        bottomMax = treeHeight;
        if (!visible[y][x]) {
          visibleCount++;
          visible[y][x] = true;
        }
      }
    }
  }

  return visibleCount;
}

run();