import readInputToLines from './util/util.js';
import MinHeapMap from './util/heap.js';

let DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]]

export default function day16() {
    let input = readInputToLines('inputs/16.txt').map(x => x.split(''));


    let startX, startY, endX, endY;
    for(let i = 0; i < input.length; ++i) {
        for(let j = 0; j < input.length; ++j) {
            if(input[i][j] === 'S') {
                startX = j;
                startY = i;
            } else if(input[i][j] === 'E') {
                endX = j;
                endY = i;
            }
        }
    }

    let seen = new Array(input.length*input[0].length*4).fill(0);
    let h = new MinHeapMap([], 0, true, cmp, false);

    seen[startY*input[0].length*4 + startX + 1] = 1;

    //cost, x, y, direction
    h.push([0, startX, startY, 1]);
    while(h.size) {
        let [cost, x, y, direction] = h.pop();

        if(x === endX && y === endY) {
            return cost;
        }

        //l, r
        for(let dir of [(DIRECTIONS.length+(direction - 1))%DIRECTIONS.length, (DIRECTIONS.length+(direction + 1))%DIRECTIONS.length]) {
            let dpIdx = y*input[0].length*4 + x*4 + dir;
            if(seen[dpIdx]) { continue; }
            seen[dpIdx] = 1;

            h.push([cost + 1000, x, y, dir]);
        }

        //forwards
        {
            let newY = DIRECTIONS[direction][0] + y;
            let newX = DIRECTIONS[direction][1] + x;
            let dpIdx = newY*input[0].length*4 + newX*4 + direction;
            if(seen[dpIdx]) { continue; }
            if(input[newY][newX] === '#') { continue; }
            seen[dpIdx] = 1;
            
            h.push([cost+1, newX, newY, direction]);
        }
        
    }

    function cmp(a, b) {
        return a[0] - b[0];
    }
}

console.time()
console.log(day16());
console.timeEnd()
