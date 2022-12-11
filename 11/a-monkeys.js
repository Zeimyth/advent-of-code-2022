const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const run = () => {
  let monkeys;

  if (MANUAL_INPUT) {
    monkeys = getManualInput();
  } else {
    monkeys = getLinesFromInputFile();
  }

  const result = implementation(monkeys);
  console.log(result);
};

const getManualInput = () => {
  return [
    {
      items: [79, 98],
      inspect: (old) => old * 19,
      testDivisor: 23,
      testPass: 2,
      testFail: 3,
      itemsInspected: 0,
    },
    {
      items: [54, 65, 75, 74],
      inspect: (old) => old + 6,
      testDivisor: 19,
      testPass: 2,
      testFail: 0,
      itemsInspected: 0,
    },
    {
      items: [79, 60, 97],
      inspect: (old) => old * old,
      testDivisor: 13,
      testPass: 1,
      testFail: 3,
      itemsInspected: 0,
    },
    {
      items: [74],
      inspect: (old) => old + 3,
      testDivisor: 17,
      testPass: 0,
      testFail: 1,
      itemsInspected: 0,
    },
  ];
}

const getLinesFromInputFile = () => {
  return [
    {
      items: [89, 73, 66, 57, 64, 80],
      inspect: (old) => old * 3,
      testDivisor: 13,
      testPass: 6,
      testFail: 2,
      itemsInspected: 0,
    },
    {
      items: [83, 78, 81, 55, 81, 59, 69],
      inspect: (old) => old + 1,
      testDivisor: 3,
      testPass: 7,
      testFail: 4,
      itemsInspected: 0,
    },
    {
      items: [76, 91, 58, 85],
      inspect: (old) => old * 13,
      testDivisor: 7,
      testPass: 1,
      testFail: 4,
      itemsInspected: 0,
    },
    {
      items: [71, 72, 74, 76, 68],
      inspect: (old) => old * old,
      testDivisor: 2,
      testPass: 6,
      testFail: 0,
      itemsInspected: 0,
    },
    {
      items: [98, 85, 84],
      inspect: (old) => old + 7,
      testDivisor: 19,
      testPass: 5,
      testFail: 7,
      itemsInspected: 0,
    },
    {
      items: [78],
      inspect: (old) => old + 8,
      testDivisor: 5,
      testPass: 3,
      testFail: 0,
      itemsInspected: 0,
    },
    {
      items: [86, 70, 60, 88, 88, 78, 74, 83],
      inspect: (old) => old + 4,
      testDivisor: 11,
      testPass: 1,
      testFail: 2,
      itemsInspected: 0,
    },
    {
      items: [81, 58],
      inspect: (old) => old + 5,
      testDivisor: 17,
      testPass: 3,
      testFail: 5,
      itemsInspected: 0,
    },
  ];
}

const implementation = (monkeys) => {
  for (let round = 0; round < 20; round++) {
    for (let monkeyIdx = 0; monkeyIdx < monkeys.length; monkeyIdx++) {
      const monkey = monkeys[monkeyIdx];

      while (monkey.items.length) {
        processItem(monkey, monkeys);
      }

    }
    if (DEBUG) {
      console.log(`After round ${round + 1}, items = ${JSON.stringify(monkeys.map(monkey => monkey.items))}`);
    }
  }

  const inspections = monkeys.map(monkey => monkey.itemsInspected);
  if (DEBUG) {
    console.log(`Total inspections: ${JSON.stringify(inspections)}`);
  }
  inspections.sort((a, b) => b - a);

  return inspections[0] * inspections[1];
};

const processItem = (monkey, monkeys) => {
  let worry = monkey.items[0];
  monkey.items = monkey.items.slice(1);

  worry = monkey.inspect(worry);
  worry = Math.floor(worry / 3);

  let recipient;
  if (worry % monkey.testDivisor == 0) {
    recipient = monkey.testPass
  } else {
    recipient = monkey.testFail;
  }

  monkeys[recipient].items.push(worry);
  monkey.itemsInspected++;
};

run();