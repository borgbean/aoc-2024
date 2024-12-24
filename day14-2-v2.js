import readInputToLines from "./util/util.js";

const DIRECTIONS = [[0, 1], [0, -1], [-1, 0], [1, 0]];

export default function day14(drawIt) {
    let input = readInputToLines('inputs/14.txt');
    let w = 101;
    let h = 103;

    let robotRe = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/;
    
    let positions = new Uint32Array(w*h).fill(0);
    let robots = [];

    for(let robotStr of input) {
        let match = robotStr.match(robotRe);

        let x = Number(match[1]);
        let y = Number(match[2]);
        let vX = Number(match[3]);
        let vY = Number(match[4]);

        robots.push([x, y, vX, vY]);
    }

    
    let startGroupNum = 0;

    let groupParents = new Uint32Array(4096);
    let groupCounts = new Uint32Array(4096);
    for(let i = 1; i < 1e9; ++i) {
        let maxGroupSize = 0;
        let groupIdx = 1;
        function findRoot(group) {
            while(groupParents[group] !== group) {
                group = groupParents[group];
            }

            return group;
        }
        function mergeGroups(g1, g2) {
            if(g1 === null) { return g2; }
            
            let r1 = findRoot(g1);
            let r2 = findRoot(g2);

            if(r1 === r2) { return r1; }

            groupCounts[r1] += groupCounts[r2];
            groupParents[r2] = r1;
            return r1;
        }

        for(let robot of robots) {
            let x = robot[0];
            let y = robot[1];
            let vX = robot[2];
            let vY = robot[3];
            
            let finalX = (w+((x + vX)%w))%w;
            let finalY = (h+((y + vY)%h))%h;

            let newDpIdx = finalX + finalY*w;
            
            robot[0] = finalX;
            robot[1] = finalY;

            let group = null;
            
            for(let dirs of DIRECTIONS) {
                let newX = finalX + dirs[0];
                let newY = finalY + dirs[1];
                
                if(newX < 0 || newY < 0 || newX >= w || newY >= h) {
                    continue;
                }
                let newDpIdx2 = newX + newY*w;

                if(positions[newDpIdx2] > startGroupNum) {
                    group = mergeGroups(group, positions[newDpIdx2]-startGroupNum);
                }
            }
            if(group === null) {
                group = groupIdx++;
                groupParents[group] = group;
                groupCounts[group] = 0;
            }

            ++groupCounts[group];
            positions[newDpIdx] = group + startGroupNum;
            
            maxGroupSize = Math.max(maxGroupSize, groupCounts[group]);
        }

        if(maxGroupSize > 44) {

            if(drawIt) { drawGrid(startGroupNum); }
            
            return i;
        }

        startGroupNum += groupParents.length;
    }




    

    function drawGrid (startGroupNum) {
        for(let i = 0; i < h; ++i) {
            let row = [];
            let rowCount = 0;

            let startIdx = i*w;
            for(let j = 0; j < w; ++j) {
                if(positions[startIdx + j] > startGroupNum) {
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



// console.profile()
console.time()
console.log(day14(0));
console.timeEnd()
// console.profileEnd()
