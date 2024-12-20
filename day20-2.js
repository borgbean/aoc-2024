import readInputToLines from "./util/util.js";

let DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]];

export default function day20() {
    let input = readInputToLines('inputs/20.txt').map(x => x.split(''));
    
    let cols = input[0].length;
    let rows = input.length;

    let startX, startY, endX, endY;

    for(let i = 0; i < input.length; ++i) {
        for(let j = 0; j < input[0].length; ++j) {
            if(input[i][j] === 'E') {
                endX = j;
                endY = i;
            } else if(input[i][j] === 'S') {
                startX = j;
                startY = i;
            }
        }
    }

    let fromEnd = input.map(x => x.map(x => Infinity));
    fromEnd[endY][endX] = 0;

    {
        let q = [[endX, endY]];
        let q2 = [];
        let dist = 0;
    
        while(q.length) {
            let [x, y] = q.pop();

            for(let [xOff, yOff] of DIRECTIONS) {
                let newX = x + xOff;
                let newY = y + yOff;
                if(newX < 0 || newY < 0 || newX >= cols || newY >= cols) { continue; }
                if(fromEnd[newY][newX] < Infinity) { continue; }
                if(input[newY][newX] === '#') { continue; }

                fromEnd[newY][newX] = dist+1;

                q2.push([newX, newY]);
            }
    
            if(!q.length) {
                [q, q2] = [q2, q];
                ++dist;
            }
        }
    }

    let totalCheat = 20;
    let targetSavings = 100;
    let count = 0;

    for(let i = 0; i < rows; ++i) {
        for(let j = 0; j < cols; ++j) {
            let startDist = fromEnd[i][j];
            if(startDist >= Infinity) { continue; }
            
            for(let iDist = 0; iDist <= totalCheat && (i+iDist) < rows; ++iDist) {
                for(let jDist = iDist > 0 ? Math.max(-totalCheat + iDist, -j) : 0; (iDist + jDist) <= totalCheat && (j+jDist) < cols; ++jDist) {
                    let i2 = i + iDist;
                    let j2 = j + jDist;

                    let endDist = fromEnd[i2][j2];
                    if(endDist >= Infinity) { continue; }
                    if((Math.abs((startDist-endDist))-(iDist + Math.abs(jDist))) >= targetSavings) {
                        ++count;
                    }
                }
            }
            
        }
    }

    return count;
}

console.time()
console.log(day20());
console.timeEnd()
