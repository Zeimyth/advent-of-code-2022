const fs = require('fs');

const lines = fs.readFileSync('./input.txt', 'utf-8').split('\n');

const calories = [];
let soFar = 0;
let max = -1;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === '' && soFar > 0) {
        if (soFar > max) {
            max = soFar;
        }
        calories.push(soFar);
        soFar = 0;
    } else {
        soFar += parseInt(line);
    }
}

if (soFar > max) {
    max = soFar;
}
calories.push(soFar);

console.log(`${max}`);
