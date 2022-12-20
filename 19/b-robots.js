const fs = require('fs');

const DEBUG = true;
const MANUAL_INPUT = false;

const DO_NOTHING = 'nothing';
const BUILD_ORE_ROBOT = 'ore';
const BUILD_CLAY_ROBOT = 'clay';
const BUILD_OBSIDIAN_ROBOT = 'obsidian';
const BUILD_GEODE_ROBOT = 'geode';

const ALLOW_ALL_ACTIONS = new Set();

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
    'Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.',
    'Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.',
  ];
};

const getLinesFromInputFile = () => {
  return fs.readFileSync('./input.txt', 'utf-8').split('\n');
};

const implementation = (lines) => {
  const blueprints = parseBlueprints(lines.slice(0, 3));
  
  return mult(
    blueprints.map((blueprint) => {
      const geodes = getMaxGeodesForBlueprint(blueprint);
      console.log(`Blueprint ${JSON.stringify(blueprint)} resulted in ${geodes} geodes`);
      return geodes;
    })
  );
};

const parseBlueprints = (lines) => {
  const blueprintRegex = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./;
  return lines.map((line) => {
    const [_, id, oreRobotOreCost, clayRobotOreCost, obsidianRobotOreCost, obsidianRobotClayCost, geodeRobotOreCost, geodeRobotObsidianCost] = line.match(blueprintRegex);

    return {
      id: parseInt(id),
      oreRobot: {ore: parseInt(oreRobotOreCost)},
      clayRobot: {ore: parseInt(clayRobotOreCost)},
      obsidianRobot: {ore: parseInt(obsidianRobotOreCost), clay: parseInt(obsidianRobotClayCost)},
      geodeRobot: {ore: parseInt(geodeRobotOreCost), obsidian: parseInt(geodeRobotObsidianCost)},
    };
  });
};

const getMaxGeodesForBlueprint = (blueprint) => {
  const minutes = 32;

  const oreRobots = 1;
  const clayRobots = 0;
  const obsidianRobots = 0;
  const geodeRobots = 0;

  const ore = 0;
  const clay = 0;
  const obsidian = 0;
  const geodes = 0;

  return processBlueprintRecursive(blueprint, minutes, oreRobots, clayRobots, obsidianRobots, geodeRobots, ore, clay, obsidian, geodes, ALLOW_ALL_ACTIONS);
};

const processBlueprintRecursive = (blueprint, minutes, oreRobots, clayRobots, obsidianRobots, geodeRobots, ore, clay, obsidian, geodes, skipActions) => {
  if (minutes <= 0) {
    return geodes;
  }

  // let minutesUntilAction = minutes;
  const actions = [DO_NOTHING];
  if (ore >= blueprint.oreRobot.ore && !skipActions.has(BUILD_ORE_ROBOT)) {
    // minutesUntilAction = 1;
    actions.push(BUILD_ORE_ROBOT);
  // } else {
  //   const minutesUntilOreRobot = Math.ceil(blueprint.oreRobot.ore - ore / oreRobots);
  //   if (minutesUntilOreRobot < minutesUntilAction) {
  //     minutesUntilAction = minutesUntilOreRobot;
  //   }
  }
  if (ore >= blueprint.clayRobot.ore && !skipActions.has(BUILD_CLAY_ROBOT)) {
    // minutesUntilAction = 1;
    actions.push(BUILD_CLAY_ROBOT);
  // } else {
  //   const minutesUntilClayRobot = Math.ceil(blueprint.clayRobot.ore - ore / oreRobots);
  //   if (minutesUntilClayRobot < minutesUntilAction) {
  //     minutesUntilAction = minutesUntilClayRobot;
  //   }
  }
  if (ore >= blueprint.obsidianRobot.ore && clay >= blueprint.obsidianRobot.clay && !skipActions.has(BUILD_OBSIDIAN_ROBOT)) {
    // minutesUntilAction = 1;
    actions.push(BUILD_OBSIDIAN_ROBOT);
  // } else {
  //   if (clayRobots > 0) {
  //     const minutesUntilObsidianRobot = Math.max(
  //       Math.ceil(blueprint.obsidianRobot.ore - ore / oreRobots),
  //       Math.ceil(blueprint.obsidianRobot.clay - clay / clayRobots),
  //     );
  //     if (minutesUntilObsidianRobot < minutesUntilAction) {
  //       minutesUntilAction = minutesUntilObsidianRobot;
  //     }
  //   }
  }
  if (ore >= blueprint.geodeRobot.ore && obsidian >= blueprint.geodeRobot.obsidian && !skipActions.has(BUILD_GEODE_ROBOT)) {
    // minutesUntilAction = 1;
    actions.push(BUILD_GEODE_ROBOT);
  // } else {
  //   if (obsidianRobots > 0) {
  //     const minutesUntilGeodeRobot = Math.max(
  //       Math.ceil(blueprint.geodeRobot.ore - ore / oreRobots),
  //       Math.ceil(blueprint.geodeRobot.obsidian - obsidian / obsidianRobots),
  //     );
  //     if (minutesUntilGeodeRobot < minutesUntilAction) {
  //       minutesUntilAction = minutesUntilGeodeRobot;
  //     }
  //   }
  }

  // const minutesDiff = Math.max(1, minutesUntilAction - 1)
  const minutesDiff = 1;
  const newMinutes = minutes - minutesDiff;
  const newOre = ore + oreRobots * minutesDiff;
  const newClay = clay + clayRobots * minutesDiff;
  const newObsidian = obsidian + obsidianRobots * minutesDiff;
  const newGeodes = geodes + geodeRobots * minutesDiff;

  return max(
    actions.map((action) => {
      if (action == BUILD_ORE_ROBOT) {
        return processBlueprintRecursive(
          blueprint,
          newMinutes,
          oreRobots + 1,
          clayRobots,
          obsidianRobots,
          geodeRobots,
          newOre - blueprint.oreRobot.ore,
          newClay,
          newObsidian,
          newGeodes,
          ALLOW_ALL_ACTIONS,
        )
      } else if (action == BUILD_CLAY_ROBOT) {
        return processBlueprintRecursive(
          blueprint,
          newMinutes,
          oreRobots,
          clayRobots + 1,
          obsidianRobots,
          geodeRobots,
          newOre - blueprint.clayRobot.ore,
          newClay,
          newObsidian,
          newGeodes,
          ALLOW_ALL_ACTIONS,
        )
      } else if (action == BUILD_OBSIDIAN_ROBOT) {
        return processBlueprintRecursive(
          blueprint,
          newMinutes,
          oreRobots,
          clayRobots,
          obsidianRobots + 1,
          geodeRobots,
          newOre - blueprint.obsidianRobot.ore,
          newClay - blueprint.obsidianRobot.clay,
          newObsidian,
          newGeodes,
          ALLOW_ALL_ACTIONS,
        )
      } else if (action == BUILD_GEODE_ROBOT) {
        return processBlueprintRecursive(
          blueprint,
          newMinutes,
          oreRobots,
          clayRobots,
          obsidianRobots,
          geodeRobots + 1,
          newOre - blueprint.geodeRobot.ore,
          newClay,
          newObsidian - blueprint.geodeRobot.obsidian,
          newGeodes,
          ALLOW_ALL_ACTIONS,
        )
      } else {
        return processBlueprintRecursive(
          blueprint,
          newMinutes,
          oreRobots,
          clayRobots,
          obsidianRobots,
          geodeRobots,
          newOre,
          newClay,
          newObsidian,
          newGeodes,
          new Set(actions),
        )
      }
    })
  );
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

const mult = (arr) => {
  return arr.reduce((soFar, size) => soFar * size, 1);
};

run();