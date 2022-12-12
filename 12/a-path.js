const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const ZERO_HEIGHT = 'a'.charCodeAt(0);

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
    'Sabqponm',
    'abcryxxl',
    'accszExk',
    'acctuvwj',
    'abdefghi',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  let start, end;
  const cells = lines.map((row, y) => {
    return row.split('').map((rawHeight, x) => {
      if (rawHeight == 'S') {
        start = {x, y};
        return 0;
      } else if (rawHeight == 'E') {
        end = {x, y};
        return 25;
      }

      return rawHeight.charCodeAt(0) - ZERO_HEIGHT;
    });
  });

  const path = findShortestPath(start, end, cells);

  if (DEBUG) {
    console.log(path.join('\n'));
  }
  // Subtract the starting cell
  return path.length - 1;
};

const findShortestPath = (start, end, cells) => {
  // https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
  const startString = JSON.stringify(start);
  const endString = JSON.stringify(end);
  let openSet = [[startString, guess(start, end)]];
  const cameFrom = new Map();
  // Length of shortest path to a cell
  const gScore = new Map();
  gScore.set(startString, 0);
  const fScore = new Map();
  fScore.set(startString, guess(start, end));

  let iterations = 0;

  while (openSet.length > 0) {
    iterations++;
    const current = JSON.parse(openSet[0][0]);
    const currentString = JSON.stringify(current);

    if (DEBUG && iterations % 1000 == 0) {
      console.log(`After ${iterations} iterations, openSet has ${openSet.length} cells. Currently visiting ${currentString}`);
    }

    if (currentString == endString) {
      let backtrack = currentString;
      totalPath = [backtrack];
      while (cameFrom.has(backtrack)) {
        backtrack = cameFrom.get(backtrack);
        totalPath.push(backtrack);
      }
      return totalPath.reverse();
    } else {
      openSet = openSet.slice(1);
      const neighbors = [
        {x: current.x + 1, y: current.y},
        {x: current.x, y: current.y - 1},
        {x: current.x - 1, y: current.y},
        {x: current.x, y: current.y + 1},
      ];

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        if (neighbor.x < 0 || neighbor.y < 0 || neighbor.x >= cells[0].length || neighbor.y >= cells.length) {
          continue;
        }

        const neighborString = JSON.stringify(neighbor);

        if (!gScore.has(neighborString)) {
          gScore.set(neighborString, Number.MAX_SAFE_INTEGER);
        }

        const weightDiff = cells[neighbor.y][neighbor.x] - cells[current.y][current.x];
        if (weightDiff > 1) {
          // Can't go this way
          continue;
        } else { 
          const neighborGScore = gScore.get(currentString) + 1;

          if (neighborGScore < gScore.get(neighborString)) {
            // Found a better path to neighbor
            if (DEBUG) {
              console.log(`Found a better path to ${JSON.stringify(neighbor)}`);
            }
            cameFrom.set(neighborString, currentString);
            gScore.set(neighborString, neighborGScore);
            fScore.set(neighborString, neighborGScore + guess(neighbor, end));

            updateOpenSet(openSet, fScore, neighbor);
          }
        }
      }
    }
  }
};

const guess = (cell, end) => {
  const dx = end.x - cell.x;
  const dy = end.y - cell.y;

  return dx + dy;
};

const updateOpenSet = (openSet, fScores, updatedCell) => {
  const updatedCellString = JSON.stringify(updatedCell);
  const entryInOpenSet = openSet.find((entry) => entry[0] == updatedCellString);

  if (entryInOpenSet) {
    entryInOpenSet[1] = fScores.get(updatedCellString);
  } else {
    openSet.push([updatedCellString, fScores.get(updatedCellString)]);
  }

  openSet.sort((a, b) => a[1] - b[1]);
};

run();