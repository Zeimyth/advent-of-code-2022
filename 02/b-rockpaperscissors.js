const fs = require('fs');

const lines = fs.readFileSync('./input.txt', 'utf-8').split('\n');

const ROCK_CHOICE_SCORE = 1;
const PAPER_CHOICE_SCORE = 2;
const SCISSORS_CHOICE_SCORE = 3;

const LOSS_SCORE = 0;
const DRAW_SCORE = 3;
const WIN_SCORE = 6;

const P1_ROCK = 'A'
const P1_PAPER = 'B'
const P1_SCISSORS = 'C'

const WE_LOSE = 'X'
const WE_DRAW = 'Y'
const WE_WIN = 'Z'

const playRound = (p1, outcome) => {
  if (outcome == WE_LOSE) {
    if (p1 == P1_ROCK) {
      return LOSS_SCORE + SCISSORS_CHOICE_SCORE;
    } else if (p1 == P1_PAPER) {
      return LOSS_SCORE + ROCK_CHOICE_SCORE;
    } else {
      return LOSS_SCORE + PAPER_CHOICE_SCORE;
    }
  } else if (outcome == WE_DRAW) {
    if (p1 == P1_ROCK) {
      return DRAW_SCORE + ROCK_CHOICE_SCORE;
    } else if (p1 == P1_PAPER) {
      return DRAW_SCORE + PAPER_CHOICE_SCORE;
    } else {
      return DRAW_SCORE + SCISSORS_CHOICE_SCORE;
    }
  } else {
    if (p1 == P1_ROCK) {
      return WIN_SCORE + PAPER_CHOICE_SCORE;
    } else if (p1 == P1_PAPER) {
      return WIN_SCORE + SCISSORS_CHOICE_SCORE;
    } else {
      return WIN_SCORE + ROCK_CHOICE_SCORE;
    }
  }
}

let total = 0;
for (let i = 0; i < lines.length; i++) {
  const [p1, outcome] = lines[i].split(' ');
  total += playRound(p1, outcome);
}

console.log(total);
