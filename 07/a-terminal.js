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
    '$ cd /',
    '$ ls',
    'dir a',
    '14848514 b.txt',
    '8504156 c.dat',
    'dir d',
    '$ cd a',
    '$ ls',
    'dir e',
    '29116 f',
    '2557 g',
    '62596 h.lst',
    '$ cd e',
    '$ ls',
    '584 i',
    '$ cd ..',
    '$ cd ..',
    '$ cd d',
    '$ ls',
    '4060174 j',
    '8033020 d.log',
    '5626152 d.ext',
    '7214296 k',
  ];
}

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
}

const implementation = (lines) => {
  const tree = buildTree(lines);
  calculateSizeRecursive(tree);

  return calculateSumOfFoldersLessThanOneHundredThousandBytes(tree);
};

const buildTree = (lines) => {
  let currentDirectory = [];
  const fileTree = newFolder('/');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.indexOf('$') == 0) {
      if (line == '$ cd /') {
        if (DEBUG) {
          console.log(`Navigating to root`);
        }
        currentDirectory = [''];
      } else if (line == '$ cd ..') {
        currentDirectory.pop();
        if (DEBUG) {
          console.log(`Navigating up a directory to ${cwd(currentDirectory)}`);
        }
      } else if (line.indexOf('$ cd ') == 0) {
        const name = line.substring('$ cd '.length);
        currentDirectory.push(name);
        if (DEBUG) {
          console.log(`Navigating into directory ${name}: ${cwd(currentDirectory)}`);
        }
      } else if (line.indexOf('$ ls') == 0) {
        continue;
      } else {
        throw new Error(`Unsupported command ${line}`);
      }
    } else {
      if (line.indexOf('dir ') == 0) {
        const name = line.substring('dir '.length);
        if (DEBUG) {
          console.log(`Discovered directory ${name}`);
        }
        addFolder(newFolder(name), fileTree, currentDirectory);
      } else {
        const [rawSize, name] = line.split(' ');
        const size = parseInt(rawSize);
        if (DEBUG) {
          console.log(`Discovered file ${name} (${size}b)`);
        }
        addFile(newFile(name, size), fileTree, currentDirectory);
      }
    }
  }

  return fileTree;
};

const cwd = (directory) => {
  if (directory.length == 1) {
    return '/';
  } else {
    return directory.join('/');
  }
};

const newFolder = (name) => {
  return {
    name,
    type: 1,
    folders: [],
    files: [],
  };
};

const newFile = (name, size) => {
  return {
    name,
    type: 2,
    size,
  };
};

const addFolder = (folder, tree, pos) => {
  const loc = findFolder(tree, pos);
  loc.folders.push(folder);
};

const addFile = (file, tree, pos) => {
  const loc = findFolder(tree, pos);
  loc.files.push(file);
};

const findFolder = (tree, pos) => {
  let loc = tree;
  for (let i = 1; i < pos.length; i++) {
    loc = loc.folders.find((folder) => folder.name == pos[i]);
  }
  return loc;
};

const calculateSizeRecursive = (folder) => {
  if (DEBUG) {
    console.log(`Calculating size for ${folder.name}`);
  }
  folder.folders.forEach(calculateSizeRecursive);
  const mySize = sum(folder.files.map(file => file.size));
  const childSizes = sum(folder.folders.map(folder => folder.size));

  folder.size = mySize + childSizes;
  if (DEBUG) {
    console.log(`Folder ${folder.name} is ${folder.size}b`);
  }
};

const calculateSumOfFoldersLessThanOneHundredThousandBytes = (folder) => {
  const childSum = sum(folder.folders.map(calculateSumOfFoldersLessThanOneHundredThousandBytes));
  if (folder.size < 100000) {
    return childSum + folder.size;
  } else {
    return childSum;
  }
};

const sum = (arr) => {
  return arr.reduce((soFar, size) => soFar + size, 0);
}

run();