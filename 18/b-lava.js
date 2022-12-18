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
  const voxels = [];

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

    const voxel = {x, y, z};
    voxels.push(voxel);
    addToMap(voxel, voxelMap);
  }

  const boundary = {
    map: new Map(),
    xMin,
    xMax,
    yMin,
    yMax,
    zMin,
    zMax,
  };

  let exposedFaces = 0;
  for (let i = 0; i < voxels.length; i++) {
    const voxel = voxels[i];
    exposedFaces += checkFace(voxel, voxelMap, boundary, 0, 0, -1);
    exposedFaces += checkFace(voxel, voxelMap, boundary, 0, 0, 1);
    exposedFaces += checkFace(voxel, voxelMap, boundary, 0, -1, 0);
    exposedFaces += checkFace(voxel, voxelMap, boundary, 0, 1, 0);
    exposedFaces += checkFace(voxel, voxelMap, boundary, -1, 0, 0);
    exposedFaces += checkFace(voxel, voxelMap, boundary, 1, 0, 0);
  }

  return exposedFaces;
};

const checkFace = (voxel, voxelMap, boundary, dx, dy, dz) => {
  const x = voxel.x + dx;
  const y = voxel.y + dy;
  const z = voxel.z + dz;
  const neighborVoxel = {x, y, z};

  const emptyNeighbor = !voxelInMap(neighborVoxel, voxelMap);
  if (emptyNeighbor && canReachBoundary(neighborVoxel, voxelMap, boundary)) {
    return 1;
  } else {
    return 0;
  }
};

const canReachBoundary = (voxel, voxelMap, boundary, visitedMap) => {
  visitedMap = visitedMap || new Map();
  if (
    voxel.x < boundary.xMin ||
    voxel.x > boundary.xMax ||
    voxel.y < boundary.yMin ||
    voxel.y > boundary.yMax ||
    voxel.z < boundary.zMin ||
    voxel.z > boundary.zMax
  ) {
    return true;
  } else if (voxelInMap(voxel, boundary.map)) {
    return true;
  } else if (voxelInMap(voxel, voxelMap)) {
    return false;
  } else if (voxelInMap(voxel, visitedMap)) {
    return false;
  } else {
    addToMap(voxel, visitedMap);
    const canReach =
      canReachBoundary({x: voxel.x, y: voxel.y, z: voxel.z - 1}, voxelMap, boundary, visitedMap) ||
      canReachBoundary({x: voxel.x, y: voxel.y, z: voxel.z + 1}, voxelMap, boundary, visitedMap) ||
      canReachBoundary({x: voxel.x, y: voxel.y - 1, z: voxel.z}, voxelMap, boundary, visitedMap) ||
      canReachBoundary({x: voxel.x, y: voxel.y + 1, z: voxel.z}, voxelMap, boundary, visitedMap) ||
      canReachBoundary({x: voxel.x - 1, y: voxel.y, z: voxel.z}, voxelMap, boundary, visitedMap) ||
      canReachBoundary({x: voxel.x + 1, y: voxel.y, z: voxel.z}, voxelMap, boundary, visitedMap);
    
    if (canReach) {
      addToMap(voxel, boundary.map);
      return true;
    }
  }
};

const addToMap = (voxel, map) => {
  if (!map.has(voxel.z)) {
    map.set(voxel.z, new Map());
  }
  if (!map.get(voxel.z).has(voxel.y)) {
    map.get(voxel.z).set(voxel.y, new Set());
  }
  map.get(voxel.z).get(voxel.y).add(voxel.x);
};

const voxelInMap = (voxel, map) => {
  return map.has(voxel.z) && map.get(voxel.z).has(voxel.y) && map.get(voxel.z).get(voxel.y).has(voxel.x);
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