import { readFileSync } from 'fs';

let MOVES = new Map([
    ['<', [0, -1]],
    ['>', [0, 1]],
    ['^', [-1, 0]],
    ['v', [1, 0]]
]);

export default function day15() {
    let input = readFileSync('inputs/15.txt', 'utf-8').split(/(?:\r?\n){2}/);

    let grid =
        input[0]
            .replace(/\#/g, '##')
            .replace(/\O/g, '[]')
            .replace(/\./g, '..')
            .replace(/\@/g, '@.')
            .split(/\r?\n/)
            .map(x => x.split(''));
    let moves = input[1].replace(/[\r\n]/g, '').split('');

    let x = null, y = null;
    for (let i = 0; x === null && i < grid.length; ++i) {
        for (let j = 0; j < grid[0].length; ++j) {
            if (grid[i][j] === '@') {
                x = j;
                y = i;
                break;
            }
        }
    }

    for (let move of moves) {
        let [yOff, xOff] = MOVES.get(move);


        let newX = x + xOff;
        let newY = y + yOff;

        if (grid[newY][newX] === '.') {
            grid[newY][newX] = '@';
            grid[y][x] = '.';
            y = newY;
            x = newX;
            continue;
        }
        if (grid[newY][newX] === '#') { continue; }

        let [boxL_x, boxL_y, boxR_x, boxR_y] = getBoxBounds(newY, newX);

        if(shiftBox(true, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff)) {
            shiftBox(false, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff);
            grid[y][x] = '.';
            grid[newY][newX] = '@';
            y = newY;
            x = newX;
        }

    }

    let result = 0;

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[0].length; ++j) {
            if (grid[i][j] === '[') {
                result += i * 100 + j;
            }
        }
    }

    return result;


    function shiftBox(dryRun, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff) {
        let q = [[boxL_y, boxL_x, '['], [boxR_y, boxR_x, ']']];
        let seen = new Set([toDp(boxL_y, boxL_x), toDp(boxR_y, boxR_x)]);

        if(!dryRun) {
            grid[boxL_y][boxL_x] = '.';
            grid[boxR_y][boxR_x] = '.';
        }
        
        while(q.length) {
            let [moveY, moveX, val] = q.pop();
            
            let newY = moveY + yOff;
            let newX = moveX + xOff;
            if(grid[newY][newX] === '.') {
            } else if(grid[newY][newX] === '#') {
                return false;
            } else {
                let [box2L_x, box2L_y, box2R_x, box2R_y] = getBoxBounds(newY, newX);

                if(!seen.has(toDp(box2L_y, box2L_x))) {
                    seen.add(toDp(box2L_y, box2L_x));
                    seen.add(toDp(box2R_y, box2R_x));
    
                    q.push([box2L_y, box2L_x,'['],[box2R_y, box2R_x,']']);

                    if(!dryRun) {
                        grid[box2L_y][box2L_x] = '.';
                        grid[box2R_y][box2R_x] = '.';
                    }
                }
            }

            if(!dryRun) {
                grid[newY][newX] = val;
            }
        }
        return true;
    }


    function toDp(x, y) {
        return y*grid[0].length + x;
    }

    function getBoxBounds(y, x) {
        let box2L_x, box2L_y, box2R_x, box2R_y;
        if (grid[y][x] === '[') {
            box2L_x = x;
            box2L_y = y;
        } else {
            box2L_x = x-1;
            box2L_y = y;
        }
        box2R_x = box2L_x+1;
        box2R_y = box2L_y;

        return [box2L_x, box2L_y, box2R_x, box2R_y];
    }

}

console.time()
console.log(day15());
console.timeEnd()
