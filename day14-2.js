import readInputToLines from "./util/util.js";

export default function day14(drawIt) {
    let input = readInputToLines('inputs/14.txt');
    let w = 101;
    let h = 103;

    let robotRe = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/;
    
    let positions = new Array(w*h).fill(0);
    let robots = [];

    for(let robotStr of input) {
        let match = robotStr.match(robotRe);

        let x = Number(match[1]);
        let y = Number(match[2]);
        let vX = Number(match[3]);
        let vY = Number(match[4]);

        positions[x + y*w] += 1;
        robots.push([x, y, vX, vY]);
    }


    for(let i = 1; i < 1e9; ++i) {
        for(let robot of robots) {
            let [x, y, vX, vY] = robot;
            let finalX = (w+((x + vX)%w))%w;
            let finalY = (h+((y + vY)%h))%h;

            let oldDpIdx = x + y*w;
            let newDpIdx = finalX + finalY*w;

            robot[0] = finalX;
            robot[1] = finalY;

            --positions[oldDpIdx];
            ++positions[newDpIdx];
        }

        let runs = 0;
        let curRunLen = 0;
        let MIN_RUN_WID = 7;
        for(let j = 0; j < positions.length; ++j) {
            if(positions[j]) { 
                ++curRunLen;
            } else {
                if(curRunLen > MIN_RUN_WID) { ++runs; }
                curRunLen = 0;
            }
        }
        if(curRunLen > MIN_RUN_WID) { ++runs; }
        if(runs > 8) {
            if(!drawIt) { return i; }
            
            drawGrid();
        }
    }



    function drawGrid() {
        for(let i = 0; i < h; ++i) {
            let row = [];
            let rowCount = 0;

            let startIdx = i*w;
            for(let j = 0; j < w; ++j) {
                if(positions[startIdx + j]) {
                    row.push('1')
                    ++rowCount;
                } else {
                    row.push('.')
                }
            }
            console.log(row.join(''))
        }
    }

    


}

console.time()
console.log(day14(false));
console.timeEnd()
