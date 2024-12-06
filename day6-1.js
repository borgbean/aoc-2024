import readInputToLines from "./util/util.js";


const DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const VISITED = ',';

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

    let visitedCount = 0;
    let i = startI;
    let j = startJ;
    let dir = 0;
    while(true) {
        let newI = i + DIRECTIONS[dir][0];
        let newJ = j + DIRECTIONS[dir][1];

        if(newI < 0 || newJ < 0 || newI >= input.length || newJ >= input[0].length) { break; }

        if(input[newI][newJ] === '#') {
            dir = (dir+1) % DIRECTIONS.length;
            continue;
        }

        i = newI;
        j = newJ;

        if(input[i][j] !== VISITED) {
            input[i][j] = VISITED;
            ++visitedCount;
        }
    }

    return visitedCount;
}


console.log(day6());