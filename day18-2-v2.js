import readInputToLines from "./util/util.js";

let DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]

const NORTH = 0, EAST = 1, SOUTH = 2, WEST = 4;
const CONFLICTS = new Array(16).fill(true);

CONFLICTS[NORTH] = false;
CONFLICTS[EAST] = false;
CONFLICTS[SOUTH] = false;
CONFLICTS[WEST] = false;
CONFLICTS[NORTH | EAST] = false;
CONFLICTS[WEST | SOUTH] = false;

export default function day18() {
    let input = readInputToLines('inputs/18.txt');

    let rows = 71;
    let cols = 71;

    let mat = new Uint32Array(rows*cols).fill(0);

    let groups = [0];
    let groupSides = [[]];

    for(let line of input) {
        let [x, y] = line.split(',').map(Number);

        if((x === 0 && y === 0) || (x === (cols-1) && y === (rows-1))) {
            return line;
        }

        let idx = x + y*cols;
        if(mat[idx] > 0) { continue; } //already seen


        for(let [xOff, yOff] of DIRECTIONS) {
            let newX = x + xOff;
            let newY = y + yOff;

            if(newX < 0 || newY < 0 || newX >= cols || newY >= cols) { continue; }

            let idx2 = newX + newY*cols;

            if(mat[newX + newY*cols]) {
                union(idx, idx2);
            }
        }

        let group;
        if(mat[idx] < 1) {
            group = groups.length;
            mat[idx] = group;
            groups.push(group);
            groupSides.push(0);
        } else {
            group = findRoot(idx);
        }
        let side = getSide(x, y);
        if(side !== null) {
            groupSides[group] |= side;
        }

        if(inConflict(groupSides[group])) {
            return line;
        }
    }

    return -1;

    function getSide(x, y) {
        if(x === 0) { return WEST; }
        if(y === 0) { return NORTH; }
        if(x === (cols-1)) { return EAST; }
        if(y === (rows-1)) { return SOUTH; }
        return null;
    }
    function inConflict(sides) {
        return CONFLICTS[sides];
    }
    function findRoot(idx) {
        let group = mat[idx];

        while(groups[group] !== group) {
            group = groups[group];
        }

        return group;
    }
    function union(idx1, idx2) {
        if(!mat[idx1]) {
            mat[idx1] = findRoot(idx2);
        }

        let g1 = findRoot(idx1);
        let g2 = findRoot(idx2);

        if(g1 !== g2) {
            groups[g1] = g2;
            groupSides[g2] |= groupSides[g1];
        }
    }
}

console.time()
console.log(day18());
console.timeEnd()
