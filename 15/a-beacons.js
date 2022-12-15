const fs = require('fs');

const DEBUG = false;
const MANUAL_INPUT = false;

const run = () => {
  let sensors;

  if (MANUAL_INPUT) {
    sensors = getManualInput();
  } else {
    sensors = getLinesFromInputFile();
  }

  const result = implementation(sensors);
  console.log(result);
};

const getManualInput = () => {
  return [
    {sensor: {x: 2, y: 18}, beacon: {x: -2, y: 15}},
    {sensor: {x: 9, y: 16}, beacon: {x: 10, y: 16}},
    {sensor: {x: 13, y: 2}, beacon: {x: 15, y: 3}},
    {sensor: {x: 12, y: 14}, beacon: {x: 10, y: 16}},
    {sensor: {x: 10, y: 20}, beacon: {x: 10, y: 16}},
    {sensor: {x: 14, y: 17}, beacon: {x: 10, y: 16}},
    {sensor: {x: 8, y: 7}, beacon: {x: 2, y: 10}},
    {sensor: {x: 2, y: 0}, beacon: {x: 2, y: 10}},
    {sensor: {x: 0, y: 11}, beacon: {x: 2, y: 10}},
    {sensor: {x: 20, y: 14}, beacon: {x: 25, y: 17}},
    {sensor: {x: 17, y: 20}, beacon: {x: 21, y: 22}},
    {sensor: {x: 16, y: 7}, beacon: {x: 15, y: 3}},
    {sensor: {x: 14, y: 3}, beacon: {x: 15, y: 3}},
    {sensor: {x: 20, y: 1}, beacon: {x: 15, y: 3}},
  ];
};

const getLinesFromInputFile = () => {
  return [
    {sensor: {x: 251234, y: 759482}, beacon: {x: -282270, y: 572396}},
    {sensor: {x: 2866161, y: 3374117}, beacon: {x: 2729330, y: 3697325}},
    {sensor: {x: 3999996, y: 3520742}, beacon: {x: 3980421, y: 3524442}},
    {sensor: {x: 3988282, y: 3516584}, beacon: {x: 3980421, y: 3524442}},
    {sensor: {x: 3005586, y: 3018139}, beacon: {x: 2727127, y: 2959718}},
    {sensor: {x: 3413653, y: 3519082}, beacon: {x: 3980421, y: 3524442}},
    {sensor: {x: 2900403, y: 187208}, beacon: {x: 2732772, y: 2000000}},
    {sensor: {x: 1112429, y: 3561166}, beacon: {x: 2729330, y: 3697325}},
    {sensor: {x: 3789925, y: 3283328}, beacon: {x: 3980421, y: 3524442}},
    {sensor: {x: 3991533, y: 3529053}, beacon: {x: 3980421, y: 3524442}},
    {sensor: {x: 3368119, y: 2189371}, beacon: {x: 2732772, y: 2000000}},
    {sensor: {x: 2351157, y: 2587083}, beacon: {x: 2727127, y: 2959718}},
    {sensor: {x: 3326196, y: 2929990}, beacon: {x: 3707954, y: 2867627}},
    {sensor: {x: 3839244, y: 1342691}, beacon: {x: 3707954, y: 2867627}},
    {sensor: {x: 2880363, y: 3875503}, beacon: {x: 2729330, y: 3697325}},
    {sensor: {x: 1142859, y: 1691416}, beacon: {x: 2732772, y: 2000000}},
    {sensor: {x: 3052449, y: 2711719}, beacon: {x: 2727127, y: 2959718}},
    {sensor: {x: 629398, y: 214610}, beacon: {x: -282270, y: 572396}},
    {sensor: {x: 3614706, y: 3924106}, beacon: {x: 3980421, y: 3524442}},
    {sensor: {x: 3999246, y: 2876762}, beacon: {x: 3707954, y: 2867627}},
    {sensor: {x: 3848935, y: 3020496}, beacon: {x: 3707954, y: 2867627}},
    {sensor: {x: 123637, y: 2726215}, beacon: {x: -886690, y: 3416197}},
    {sensor: {x: 4000000, y: 3544014}, beacon: {x: 3980421, y: 3524442}},
    {sensor: {x: 2524955, y: 3861248}, beacon: {x: 2729330, y: 3697325}},
    {sensor: {x: 2605475, y: 3152151}, beacon: {x: 2727127, y: 2959718}},
  ];
};

const implementation = (sensors) => {
  const scans = new Set();
  const targetRow = MANUAL_INPUT ? 10 : 2000000;

  for (let i = 0; i < sensors.length; i++) {
    const data = sensors[i];
    const distance = Math.abs(data.sensor.x - data.beacon.x) + Math.abs(data.sensor.y - data.beacon.y);

    if (DEBUG) {
      console.log(`Scanner ${i}: distance ${distance}`);
    }
    const horizontal = distance - Math.abs(data.sensor.y - targetRow);
    if (DEBUG && targetRow == 10) {
      console.log(`Scanner ${i} has a horizontal of ${horizontal}`)
    }
    for (let x = data.sensor.x - horizontal; x <= data.sensor.x + horizontal; x++) {
      if (data.beacon.x == x && data.beacon.y == targetRow) {
        continue;
      }
      if (DEBUG && targetRow == 10) {
        console.log(x)
      }
      scans.add(x);
    }
  }


  return scans.size;
};

run();