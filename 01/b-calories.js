const fs = require('fs');

const lines = fs.readFileSync('./input.txt', 'utf-8').split('\n');

const calories = [];
let soFar = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === '' && soFar > 0) {
        calories.push(soFar);
        soFar = 0;
    } else {
        soFar += parseInt(line);
    }
}

calories.push(soFar);

calories.sort((a, b) => b - a);

const sum = calories[0] + calories[1] + calories[2];

console.log(`${sum}`);
