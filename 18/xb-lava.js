const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = true;

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
    '2,2,2',
    '1,2,2',
    '3,2,2',
    '2,1,2',
    '2,3,2',
    '2,2,1',
    '2,2,3',
    '2,2,4',
    '2,2,6',
    '1,2,5',
    '3,2,5',
    '2,1,5',
    '2,3,5',
  ];

  // return [
  //   '1,1,1',
  //   '2,1,1',
  // ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  const voxelMap = new Map();

  let zMin = Number.MAX_SAFE_INTEGER;
  let zMax = 0;
  let yMin = Number.MAX_SAFE_INTEGER;
  let yMax = 0;
  let xMin = Number.MAX_SAFE_INTEGER;
  let xMax = 0;

  for (let i = 0; i < lines.length; i++) {
    const [xRaw, yRaw, zRaw] = lines[i].split(',');
    const x = parseInt(xRaw);
    const y = parseInt(yRaw);
    const z = parseInt(zRaw);

    if (x < xMin) {
      xMin = x;
    } else if (x > xMax) {
      xMax = x;
    }

    if (y < yMin) {
      yMin = y;
    } else if (y > yMax) {
      yMax = y;
    }

    if (z < zMin) {
      zMin = z;
    } else if (z > zMax) {
      zMax = z;
    }

    if (!voxelMap.has(z)) {
      voxelMap.set(z, new Map());
    }
    if (!voxelMap.get(z).has(y)) {
      voxelMap.get(z).set(y, new Set());
    }
    voxelMap.get(z).get(y).add(x);
  }

  if (DEBUG) {
    console.log(`Encompassed by cube from (${xMin}, ${yMin}, ${zMin}) to (${xMax}, ${yMax}, ${zMax})`);
  }

  let surfaceFaces = 0;
  for (let z = zMin; z <= zMax; z++) {
    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        if (!voxelMap.has(z) || !voxelMap.get(z).has(y) || !voxelMap.get(z).get(y).has(x)) {
          const voxel = {x, y, z};
          let exposedFaces = 0;
          exposedFaces += checkFace(voxel, voxelMap, 0, 0, -1);
          exposedFaces += checkFace(voxel, voxelMap, 0, 0, 1);
          exposedFaces += checkFace(voxel, voxelMap, 0, -1, 0);
          exposedFaces += checkFace(voxel, voxelMap, 0, 1, 0);
          exposedFaces += checkFace(voxel, voxelMap, -1, 0, 0);
          exposedFaces += checkFace(voxel, voxelMap, 1, 0, 0);
          if (exposedFaces == 1) {
            surfaceFaces += 1;
          }
        }
      }
    }
  }

  return surfaceFaces;
};

const checkFace = (voxel, voxelMap, dx, dy, dz) => {
  const x = voxel.x + dx;
  const y = voxel.y + dy;
  const z = voxel.z + dz;

  const emptyNeighbor = !voxelMap.has(z) || !voxelMap.get(z).has(y) || !voxelMap.get(z).get(y).has(x);
  return emptyNeighbor ? 0 : 1;
};

const min = (arr) => {
  return arr.reduce((soFar, lastMin) => Math.min(soFar, lastMin), Number.MAX_SAFE_INTEGER);
};

const max = (arr) => {
  return arr.reduce((soFar, lastMax) => Math.max(soFar, lastMax), 0);
};

const sum = (arr) => {
  return arr.reduce((soFar, size) => soFar + size, 0);
};

run();