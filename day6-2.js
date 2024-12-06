import readInputToLines from "./util/util.js";


const DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const ATTEMPTED = ',';

export default function day6() {
    let input = readInputToLines('inputs/6.txt').map(x => x.split(''));

    let startI = -1, startJ = -1;
    {
        for(let i = 0; i < input.length; ++i) {
            let done = false;
            for(let j = 0; j < input[0].length; ++j) {
                if(input[i][j] === '^') {
                    startI = i;
                    startJ = j;
                    break;
                }
            }
            if(done) { break; }
        }
    }

    let ways = 0;
    let attemptNo = 2;
    let i = startI;
    let j = startJ;
    let dir = 0;

    let dp = new Array(input.length * input[0].length * DIRECTIONS.length);
    while(true) {
        let newI = i + DIRECTIONS[dir][0];
        let newJ = j + DIRECTIONS[dir][1];

        if(newI < 0 || newJ < 0 || newI >= input.length || newJ >= input[0].length) { break; }
        
        if(input[newI][newJ] === '#') {
            dir = (dir+1) % DIRECTIONS.length;
            continue;
        }

        let dpIdx = newI*input[0].length*DIRECTIONS.length + newJ*DIRECTIONS.length + dir;
        dp[dpIdx] = -1;        
        
        if(input[newI][newJ] !== ATTEMPTED && !(newI === startI && newJ === startJ)) {
            input[newI][newJ] = '#';
            if(attempt(attemptNo++, input, i, j, dir, dp)) {
                ++ways;
            }
            input[newI][newJ] = ATTEMPTED;
        }
        i = newI;
        j = newJ;
    }

    return ways;
}


function attempt(attempt, input, i, j, dir, dp) {
    while(true) {
        let newI = i + DIRECTIONS[dir][0];
        let newJ = j + DIRECTIONS[dir][1];

        if(newI < 0 || newJ < 0 || newI >= input.length || newJ >= input[0].length) { break; }
        
        if(input[newI][newJ] === '#') {
            dir = (dir+1) % DIRECTIONS.length;
            continue;
        }

        let dpIdx = newI*input[0].length*DIRECTIONS.length + newJ*DIRECTIONS.length + dir;
        if(dp[dpIdx] < 0 || dp[dpIdx] === attempt) { return true; }
        dp[dpIdx] = attempt;

        i = newI;
        j = newJ;
    }
}


console.log(day6());