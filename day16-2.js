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

    let seen = new Array(input.length*input[0].length*4).fill(null);
    let h = new MinHeapMap([], 0, true, cmp, false);

    seen[startY*input[0].length*4 + startX + 1] = [0, []];

    //cost, x, y, direction
    h.push([0, startX, startY, 1]);
    let bestCost = Infinity;
    while(h.size) {
        let [cost, x, y, direction] = h.pop();

        let startDpIdx = y*input[0].length*4 + x*4 + direction;

        if(x === endX && y === endY) {
            if((cost) > bestCost) {
                break;
            }
            bestCost = cost;
        }

        //l, r
        for(let dir of [(DIRECTIONS.length+(direction - 1))%DIRECTIONS.length, (DIRECTIONS.length+(direction + 1))%DIRECTIONS.length]) {
            let dpIdx = y*input[0].length*4 + x*4 + dir;
            let newCost = cost + 1000;
            if(seen[dpIdx] && seen[dpIdx][0] < newCost) {  continue; }

            let wasSeen = !!seen[dpIdx];

            seen[dpIdx] ||= [newCost, []];
            seen[dpIdx][1].push(startDpIdx);


            if(!wasSeen) {
                h.push([cost + 1000, x, y, dir]);
            }
        }

        //forwards
        {
            let newY = DIRECTIONS[direction][0] + y;
            let newX = DIRECTIONS[direction][1] + x;
            let dpIdx = newY*input[0].length*4 + newX*4 + direction;
            let newCost = cost + 1;
            if(input[newY][newX] === '#') { continue; }
            if(seen[dpIdx] && seen[dpIdx][0] < newCost) {  continue; }
            //danger danger danger! we might have already marked something off, even though this is a better path
            if(seen[dpIdx] && seen[dpIdx][0] > newCost) { seen[dpIdx] = null; }

            let wasSeen = !!seen[dpIdx];

            seen[dpIdx] ||= [newCost, []];
            seen[dpIdx][1].push(startDpIdx);
            
            if(!wasSeen) {
                h.push([cost+1, newX, newY, direction]);
            }
        }
        
    }


    let finalDpIdx = endY*input[0].length*4 + endX*4;
    let minEnding = Infinity;
    for(let i = 0; i < 4; ++i) {
        if(!seen[finalDpIdx+i]) { continue; }
        minEnding = Math.min(minEnding, seen[finalDpIdx][0]);
    }

    let bestPathEligible = new Array(input.length*input[0].length).fill(0);
    let count = 0;

    for(let i = 0; i < 4; ++i) {
        if(seen[finalDpIdx+i] && seen[finalDpIdx+i][0] === minEnding) {
            dfs(finalDpIdx+i);
        }
    }

    function dfs(dpIdx) {
        let realIdx = Math.floor(dpIdx/4);
        let realY = Math.floor(realIdx / input[0].length)
        let realX = Math.floor(realIdx % input[0].length)
        
        if(!bestPathEligible[realIdx]) { ++count; }
        bestPathEligible[realIdx] = true;


        let toCheck = seen[dpIdx][1];
        seen[dpIdx][1] = [];
        for(let inIdx of toCheck) {
            dfs(inIdx);
        }
    }

    return count;
    
    function cmp(a, b) {
        return a[0] - b[0];
    }
}

console.time()
console.log(day16());
console.timeEnd()
