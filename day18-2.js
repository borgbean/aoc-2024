import readInputToLines from "./util/util.js";

let DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]]

export default function day18() {
    let input = readInputToLines('inputs/18.txt');

    let rows = 71;
    let cols = 71;


    let lo = 0;
    let hi = input.length;
    while(lo < hi) {
        let mid = Math.ceil((lo+hi)/2);

        if(attempt(mid) < 0) {
            hi = mid - 1;
        } else {
            lo = mid;
        }
    }

    return input[lo];


    function attempt(lines) {
        let grid = new Array(rows).fill(0).map(x => new Array(cols).fill(0));
        
        for(let line of input.slice(0, lines)) {
            let [x, y] = line.split(',').map(Number);
            grid[y][x] = 1;
        }
    
        let steps = 0;
        let q = [[0, 0]];
        let q2 = [];
    
        while(q.length) {
            let [x, y] = q.pop();
    
            for(let [xOff, yOff] of DIRECTIONS) {
                let newX = x+xOff;
                let newY = y+yOff;
    
                if(newX < 0 || newY < 0 || newX >= cols || newY >= rows) { continue; }
    
                if(grid[newX][newY] !== 0) { continue; }
                grid[newX][newY] = 2;

                
                if(newX === (rows-1) && newY === (cols-1)) {
                    return steps+1;
                }
    
                q2.push([newX, newY]);
            }
    
            if(!q.length) {
                [q, q2] = [q2, q];
                ++steps;
            }
        }
        return -1;
    }


    
}

console.time()
console.log(day18());
console.timeEnd()
