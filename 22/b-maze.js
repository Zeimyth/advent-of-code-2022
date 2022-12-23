const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const FACE_SIZE = MANUAL_INPUT ? 4 : 50;
const FACES = MANUAL_INPUT ? [
  {x: 2, y: 0},
  {x: 3, y: 2},
  {x: 2, y: 1},
  {x: 1, y: 1},
  {x: 0, y: 1},
  {x: 2, y: 2},
] : [
  {x: 1, y: 0},
  {x: 2, y: 0},
  {x: 1, y: 1},
  {x: 0, y: 2},
  {x: 0, y: 3},
  {x: 1, y: 2},
];
const FACE_TRAVERSAL = new Map();
if (MANUAL_INPUT) {
  FACE_TRAVERSAL.set(0, new Map());
  // FACE_TRAVERSAL.get(0).set(RIGHT, {face: 1, dir: LEFT});
  // FACE_TRAVERSAL.get(0).set(DOWN, {face: 2, dir: DOWN});
  // FACE_TRAVERSAL.get(0).set(LEFT, {face: 3, dir: DOWN});
  // FACE_TRAVERSAL.get(0).set(UP, {face: 4, dir: DOWN});
  FACE_TRAVERSAL.get(0).set(RIGHT, 1);
  FACE_TRAVERSAL.get(0).set(DOWN, 2);
  FACE_TRAVERSAL.get(0).set(LEFT, 3);
  FACE_TRAVERSAL.get(0).set(UP, 4);

  FACE_TRAVERSAL.set(1, new Map());
  FACE_TRAVERSAL.get(1).set(RIGHT, 0);
  FACE_TRAVERSAL.get(1).set(DOWN, _);
  FACE_TRAVERSAL.get(1).set(LEFT, 5);
  FACE_TRAVERSAL.get(1).set(UP, 2);

  FACE_TRAVERSAL.set(z, new Map());
  FACE_TRAVERSAL.get(z).set(RIGHT, _);
  FACE_TRAVERSAL.get(z).set(DOWN, _);
  FACE_TRAVERSAL.get(z).set(LEFT, _);
  FACE_TRAVERSAL.get(z).set(UP, _);
}

const OUT_OF_BOUNDS = -1;
const OPEN = 0;
const WALL = 1;

const RIGHT = 0;
const UP = 3;
const LEFT = 2;
const DOWN = 1;

const run = () => {
  let input;

  if (MANUAL_INPUT) {
    input = getManualInput();
  } else {
    input = getLinesFromInputFile();
  }

  const result = implementation(input);
  console.log(result);
};

const getManualInput = () => {
  return {
    maze: [
      '        ...#',
      '        .#..',
      '        #...',
      '        ....',
      '...#.......#',
      '........#...',
      '..#....#....',
      '..........#.',
      '        ...#....',
      '        .....#..',
      '        .#......',
      '        ......#.',
    ],
    path: ['10R5L5R10L4R5L5'],
  };
};

const getLinesFromInputFile = () => {
  return {
    maze: fs.readFileSync('./input.txt', 'utf-8').split('\n'),
    path: fs.readFileSync('./input2.txt', 'utf-8').split('\n'),
  };
};

const implementation = (input) => {
  const maze = parseMaze(input.maze);
  const path = parsePath(input.path[0]);

  return traverseMaze(maze, path);
};

const parseMaze = (mazeLines) => {
  return mazeLines.map((mazeLine) => {
    return mazeLine.split('').map((cell) => {
      if (cell == ' ') {
        return OUT_OF_BOUNDS;
      } else if (cell == '.') {
        return OPEN;
      } else if (cell == '#') {
        return WALL;
      } else {
        throw new Error(`Unable to parse cell contents '${cell}'`);
      }
    });
  });
};

const parsePath = (rawPath) => {
  let nextR = rawPath.indexOf('R');
  let nextL = rawPath.indexOf('L');

  const path = [];
  while (nextR > 0 || nextL > 0) {
    if (nextR > 0 && nextR < nextL) {
      const distance = parseInt(rawPath.substr(0, nextR));
      path.push({distance, dir: 'R'});
      rawPath = rawPath.substr(nextR + 1);
      nextR = rawPath.indexOf('R');
      nextL = rawPath.indexOf('L');
    } else {
      const distance = parseInt(rawPath.substr(0, nextL));
      path.push({distance, dir: 'L'});
      rawPath = rawPath.substr(nextL + 1);
      nextR = rawPath.indexOf('R');
      nextL = rawPath.indexOf('L');
    }
  }

  return path;
};

const traverseMaze = (maze, path) => {
  let loc = {x: maze[0].indexOf(OPEN), y: 0, facing: RIGHT};
  for (let i = 0; i < path.length; i++) {
    const instruction = path[i];

    walkForward(loc, maze, instruction.distance);
    turn(loc, instruction.dir);
    if (DEBUG) {
      console.log(`After instruction ${JSON.stringify(instruction)}, loc = ${JSON.stringify(loc)}`);
    }
  }

  const x = loc.x + 1;
  const y = loc.y + 1;
  const facing = loc.facing;

  return y * 1000 + x * 4 + facing;
};

const walkForward = (loc, maze, distance) => {
  let dx = 0
  let dy = 0;

  for (let i = 0; i < distance; i++) {
    if (loc.facing == RIGHT) {
      dx = 1;
    } else if (loc.facing == UP) {
      dy = -1;
    } else if (loc.facing == LEFT) {
      dx = -1;
    } else if (loc.facing == DOWN) {
      dy = 1;
    }

    let newX = loc.x + dx;
    let newY = loc.y + dy;
    let newDir = loc.facing;

    if (DEBUG) {
      console.log(`Trying to walk forward to (${newX}, ${newY})`);
    }
    if (inArrayBounds(maze, newX, newY)) {
      if (maze[newY][newX] == WALL) {
        break;
      } else if (maze[newY][newX] == OUT_OF_BOUNDS) {
        if (DEBUG) {
          console.log(`Next step to (${newX}, ${newY}) is OUT_OF_BOUNDS`);
        }

        const faceX = Math.floor(loc.x / FACE_SIZE);
        const faceY = Math.floor(loc.y / FACE_SIZE);
        const faceIdx = FACES.find((face) => face.x == faceX && face.y == faceY);

        let nextFaceIdx;
        if (faceIdx == 0) {
          if (loc.facing == RIGHT) {
            nextFaceId = 1;
            newDir = MANUAL_INPUT ? LEFT : RIGHT;
          }
        }

        // Only wrap if we don't hit a wall
        if (maze[wrappedY][wrappedX] == OPEN) {
          if (DEBUG) {
            console.log(`Found an open space; committing to wrap`);
          }
          newX = wrappedX;
          newY = wrappedY;
          newDir = _;
        } else {
          if (DEBUG) {
            console.log(`Found a wall; preventing wrap`);
          }
          newX = loc.x;
          newY = loc.y;
        }
      } else {
        // Next space is open; do nothing
      }
    } else {
      let wrappedX = loc.x;
      let wrappedY = loc.y;

      while (
        inArrayBounds(maze, wrappedX, wrappedY) &&
        maze[wrappedY][wrappedX] != OUT_OF_BOUNDS
      ) {
        wrappedX -= dx;
        wrappedY -= dy;
      }

      // We stopped on an illegal or out of bounds cell; backstep once
      wrappedX += dx;
      wrappedY += dy;

      // Only wrap if we don't hit a wall
      if (maze[wrappedY][wrappedX] == OPEN) {
        newX = wrappedX;
        newY = wrappedY;
      } else {
        newX = loc.x;
        newY = loc.y;
      }
    }

    if (loc.x == newX && loc.y == newY) {
      // Hit a wall; stop walking forward
      break;
    } else {
      loc.x = newX;
      loc.y = newY;
      loc.facing = newDir;
    }
  }
};

const inArrayBounds = (maze, x, y) => {
  return y >= 0 && y < maze.length && x >= 0 && x < maze[y].length;
};

const turn = (loc, dir) => {
  if (dir == 'R') {
    loc.facing = safeMod(loc.facing + 1, 4);
  } else {
    loc.facing = safeMod(loc.facing - 1, 4);
  }
};

const safeMod = (n, m) => (((n % m) + m) % m);

run();