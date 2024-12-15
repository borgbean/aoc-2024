import {readFileSync} from 'fs';

let MOVES = new Map([
    ['<', [0, -1]],
    ['>', [0, 1]],
    ['^', [-1, 0]],
    ['v', [1, 0]]
]);

export default function day15() {
    let input = readFileSync('inputs/15.txt', 'utf-8').split(/(?:\r?\n){2}/);

    let grid = input[0].split(/\r?\n/).map(x => x.split(''));
    let moves = input[1].replace(/[\r\n]/g, '').split('');

    let x = null, y = null;
    for(let i = 0; x === null && i < grid.length; ++i) {
        for(let j = 0; j < grid[0].length; ++j) {
            if(grid[i][j] === '@') {
                x = j;
                y = i;
                break;
            }
        }
    }

    for(let move of moves) {
        let [yOff, xOff] = MOVES.get(move);

        let newX = x + xOff;
        let newY = y + yOff;

        if(grid[newY][newX] === '.') {
            grid[newY][newX] = '@';
            grid[y][x] = '.';
            y = newY;
            x = newX;
            continue;
        }
        if(grid[newY][newX] === '#') { continue; }

        let destX = newX + xOff;
        let destY = newY + yOff;
        while(true) {
            if(grid[destY][destX] === '#') { break; }
            if(grid[destY][destX] === '.') {
                grid[newY][newX] = '@';
                grid[y][x] = '.';
                grid[destY][destX] = 'O';
                y = newY;
                x = newX;
                break;
            }

            destX += xOff;
            destY += yOff;
        }
    }

    let result = 0;

    for(let i = 0; i < grid.length; ++i) {
        for(let j = 0; j < grid[0].length; ++j) {
            if(grid[i][j] === 'O') {
                result += i*100 + j;
            }
        }
    }

    return result;

}

console.time()
console.log(day15());
console.timeEnd()
