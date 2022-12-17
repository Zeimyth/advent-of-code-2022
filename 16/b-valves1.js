const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const run = () => {
  let valves;

  if (MANUAL_INPUT) {
    valves = getManualInput();
  } else {
    valves = getLinesFromInputFile();
  }

  const result = implementation(valves);
  console.log(result);
};

const getManualInput = () => {
  return [
    {name: 'AA', flow: 0, exits: ['DD', 'II', 'BB']},
    {name: 'BB', flow: 13, exits: ['CC', 'AA']},
    {name: 'CC', flow: 2, exits: ['DD', 'BB']},
    {name: 'DD', flow: 20, exits: ['CC', 'AA', 'EE']},
    {name: 'EE', flow: 3, exits: ['FF', 'DD']},
    {name: 'FF', flow: 0, exits: ['EE', 'GG']},
    {name: 'GG', flow: 0, exits: ['FF', 'HH']},
    {name: 'HH', flow: 22, exits: ['GG']},
    {name: 'II', flow: 0, exits: ['AA', 'JJ']},
    {name: 'JJ', flow: 21, exits: ['II']},
  ];
};

const getLinesFromInputFile = () => {
  return [
    {name: 'SY', flow: 0, exits: ['GW', 'LW']},
    {name: 'TS', flow: 0, exits: ['CC', 'OP']},
    {name: 'LU', flow: 0, exits: ['PS', 'XJ']},
    {name: 'ND', flow: 0, exits: ['EN', 'TL']},
    {name: 'PD', flow: 0, exits: ['TL', 'LI']},
    {name: 'VF', flow: 0, exits: ['LW', 'RX']},
    {name: 'LD', flow: 0, exits: ['AD', 'LP']},
    {name: 'DG', flow: 0, exits: ['DR', 'SS']},
    {name: 'IG', flow: 8, exits: ['AN', 'YA', 'GA']},
    {name: 'LK', flow: 0, exits: ['HQ', 'LW']},
    {name: 'TD', flow: 14, exits: ['BG', 'CQ']},
    {name: 'CQ', flow: 0, exits: ['TD', 'HD']},
    {name: 'AZ', flow: 0, exits: ['AD', 'XW']},
    {name: 'ZU', flow: 0, exits: ['TL', 'AN']},
    {name: 'HD', flow: 0, exits: ['BP', 'CQ']},
    {name: 'FX', flow: 0, exits: ['LW', 'XM']},
    {name: 'CU', flow: 18, exits: ['BX', 'VA', 'RX', 'DF']},
    {name: 'SS', flow: 17, exits: ['DG', 'ZD', 'ZG']},
    {name: 'BP', flow: 19, exits: ['HD', 'ZD']},
    {name: 'DZ', flow: 0, exits: ['XS', 'CC']},
    {name: 'PS', flow: 0, exits: ['GH', 'LU']},
    {name: 'TA', flow: 0, exits: ['LI', 'AA']},
    {name: 'BG', flow: 0, exits: ['TD', 'ZG']},
    {name: 'WP', flow: 0, exits: ['OB', 'AA']},
    {name: 'XS', flow: 9, exits: ['EN', 'DZ']},
    {name: 'AA', flow: 0, exits: ['WG', 'GA', 'VO', 'WP', 'TA']},
    {name: 'LW', flow: 25, exits: ['LK', 'FX', 'SY', 'VF']},
    {name: 'AD', flow: 23, exits: ['DF', 'GW', 'AZ', 'LD', 'FM']},
    {name: 'EN', flow: 0, exits: ['ND', 'XS']},
    {name: 'ZG', flow: 0, exits: ['SS', 'BG']},
    {name: 'LI', flow: 11, exits: ['YA', 'XM', 'TA', 'PD']},
    {name: 'VO', flow: 0, exits: ['AA', 'OD']},
    {name: 'AN', flow: 0, exits: ['IG', 'ZU']},
    {name: 'GH', flow: 15, exits: ['VA', 'PS']},
    {name: 'OP', flow: 4, exits: ['AJ', 'TS', 'FM', 'BX', 'NM']},
    {name: 'BX', flow: 0, exits: ['OP', 'CU']},
    {name: 'RX', flow: 0, exits: ['CU', 'VF']},
    {name: 'FM', flow: 0, exits: ['OP', 'AD']},
    {name: 'OB', flow: 0, exits: ['WP', 'XW']},
    {name: 'CC', flow: 3, exits: ['QS', 'LP', 'DZ', 'OD', 'TS']},
    {name: 'LP', flow: 0, exits: ['LD', 'CC']},
    {name: 'NM', flow: 0, exits: ['WH', 'OP']},
    {name: 'HQ', flow: 0, exits: ['XW', 'LK']},
    {name: 'GW', flow: 0, exits: ['SY', 'AD']},
    {name: 'QS', flow: 0, exits: ['CC', 'XW']},
    {name: 'DF', flow: 0, exits: ['AD', 'CU']},
    {name: 'XM', flow: 0, exits: ['LI', 'FX']},
    {name: 'VA', flow: 0, exits: ['CU', 'GH']},
    {name: 'GA', flow: 0, exits: ['IG', 'AA']},
    {name: 'YA', flow: 0, exits: ['LI', 'IG']},
    {name: 'XW', flow: 20, exits: ['OB', 'HQ', 'QS', 'WH', 'AZ']},
    {name: 'XJ', flow: 24, exits: ['LU']},
    {name: 'AJ', flow: 0, exits: ['WG', 'OP']},
    {name: 'WH', flow: 0, exits: ['XW', 'NM']},
    {name: 'TL', flow: 13, exits: ['PD', 'DR', 'ZU', 'ND']},
    {name: 'OD', flow: 0, exits: ['CC', 'VO']},
    {name: 'ZD', flow: 0, exits: ['SS', 'BP']},
    {name: 'DR', flow: 0, exits: ['DG', 'TL']},
    {name: 'WG', flow: 0, exits: ['AJ', 'AA']},
  ];
};

const implementation = (valveLines) => {
  const valves = new Map();
  for (let i = 0; i < valveLines.length; i++) {
    valves.set(valveLines[i].name, valveLines[i]);
  }

  return recursiveSolve('AA', 'AA', 26, valves, [], null, null);
};

let ticks = 0;

const recursiveSolve = (location, elephant, minutes, valves, opened, cameFrom, elephantCameFrom) => {
  ticks++;

  if (DEBUG && ticks % 1000 == 0) {
    console.log(`Check in: In ${location} with ${minutes} minutes left`);
  }
  const pressureThisTick = sum(opened.map((v) => valves.get(v).flow));

  if (minutes == 0) {
    return 0;
  }

  let open = 0;
  if (valves.get(location).flow > 0 && opened.indexOf(location) == -1) {
    open = recursiveSolveElephantOption(location, elephant, minutes, valves, [...opened, location], null, elephantCameFrom);
  }

  const neighborPressures = valves.get(location).exits.map((e) => {
    if (cameFrom != e) {
      return recursiveSolveElephantOption(e, elephant, minutes, valves, [...opened], location, elephantCameFrom);
    } else {
      return 0;
    }
  });
  return max([...neighborPressures, open]) + pressureThisTick;
};

const recursiveSolveElephantOption = (location, elephant, minutes, valves, opened, cameFrom, elephantCameFrom) => {
  let open = 0;
  if (valves.get(location).flow > 0 && opened.indexOf(location) == -1) {
    open = recursiveSolve(location, elephant, minutes -1, valves, [...opened, location], cameFrom, null);
  }

  const neighborPressures = valves.get(location).exits.map((e) => {
    if (elephantCameFrom != e) {
      return recursiveSolve(location, e, minutes -1, valves, [...opened], location, elephantCameFrom);
    } else {
      return 0;
    }
  });
  return max([...neighborPressures, open]);
};

const max = (arr) => {
  return arr.reduce((soFar, lastMax) => Math.max(soFar, lastMax), 0);
}

const sum = (arr) => {
  return arr.reduce((soFar, size) => soFar + size, 0);
}

run();