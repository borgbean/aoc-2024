import readInputToLines from "./util/util.js";

const keypadPositions = new Map([
    ['7', [0, 0]],
    ['8', [0, 1]],
    ['9', [0, 2]],
    ['4', [1, 0]],
    ['5', [1, 1]],
    ['6', [1, 2]],
    ['1', [2, 0]],
    ['2', [2, 1]],
    ['3', [2, 2]],
    ['0', [3, 1]],
    ['A', [3, 2]]
]);

const directionalPositions = new Map([
    ['^', [0, 1]],
    ['A', [0, 2]],
    ['<', [1, 0]],
    ['v', [1, 1]],
    ['>', [1, 2]],
]);

let UP = [0, 1];
let ACTIVATE = [0, 2];
let LEFT = [1, 0];
let DOWN = [1, 1];
let RIGHT = [1, 2];


export default function day21() {
    let input = readInputToLines('inputs/21.txt');


    let ret = 0;
    for (let line of input) {
        let state = {
            positions: [
                [3, 2]
            ],
            dp: []
        };
        for (let i = 0; i < 25; ++i) {
            state.positions.push([0, 2])
        }
        let count = 0;
        for (let chr of line) {
            count += press(state, chr);
        }
        ret += count * parseInt(line, 10);
    }
    return ret;

    function copyPositions(positions) {
        return positions.map(x => x.slice());
    }

    function press(state, chr) {
        let [y, x] = state.positions[0];

        let [targetY, targetX] = keypadPositions.get(chr);

        //if in first column, and going to last row
        //OR in last row, going to first column... blah

        let stepsA = Infinity;
        let positionsA;
        if (!(x === 0 && targetY === 3)) {
            let tmp = state.positions;
            state.positions = positionsA = copyPositions(state.positions);
            stepsA = 0;

            stepsA += directionalMove(state, 1, targetY > y ? DOWN : UP, Math.abs(y - targetY));
            stepsA += directionalMove(state, 1, targetX > x ? RIGHT : LEFT, Math.abs(x - targetX));
            stepsA += directionalMove(state, 1, ACTIVATE, 1);

            state.positions = tmp;
        }
        let stepsB = Infinity;
        let positionsB
        if (!(y === 3 && targetX === 0)) {
            let tmp = state.positions;
            state.positions = positionsB = copyPositions(state.positions);
            stepsB = 0;

            stepsB += directionalMove(state, 1, targetX > x ? RIGHT : LEFT, Math.abs(x - targetX));
            stepsB += directionalMove(state, 1, targetY > y ? DOWN : UP, Math.abs(y - targetY));
            stepsB += directionalMove(state, 1, ACTIVATE, 1);

            state.positions = tmp;
        }

        if (stepsA < stepsB) {
            state.positions = positionsA;
        } else {
            state.positions = positionsB;
        }
        state.positions[0] = [targetY, targetX];

        let steps = Math.min(stepsA, stepsB);


        return steps;
    }

    function directionalMove(state, robotNum, target, count) {
        if (count < 1) { return 0; }
        if (robotNum >= state.positions.length) {
            return count;//you can just press it
        }

        let dpIdx = 
                    count*5*5*state.positions.length*5*5*5*5
                        + state.positions.slice(robotNum, robotNum + 2).reduce((acc, x, idx) => acc+(25*(idx))+x[0]*5+x[1], 0)*5*5*state.positions.length
                        + (robotNum-1)*5*5
                        + target[0]*5
                        + target[1];

        if (dpIdx in state.dp) {
            let { positions, steps } = state.dp[dpIdx];

            state.positions = state.positions.slice();
            for (let i = 0; i < positions.length; ++i) {
                state.positions[robotNum + i] = positions[i].slice();
            }

            return steps;
        }
        
        let [y, x] = state.positions[robotNum];
        
        let [targetY, targetX] = target;

        //if first row && target === first column
        //OR first column && target === first row

        let stepsA = Infinity;
        let positionsA;
        if (!(x === 0 && targetY === 0)) {
            let tmp = state.positions;
            state.positions = positionsA = copyPositions(state.positions);
            stepsA = 0;

            stepsA += directionalMove(state, robotNum + 1, targetY > y ? DOWN : UP, Math.abs(y - targetY));
            stepsA += directionalMove(state, robotNum + 1, targetX > x ? RIGHT : LEFT, Math.abs(x - targetX));
            stepsA += directionalMove(state, robotNum + 1, ACTIVATE, count)

            state.positions = tmp;
        }
        let stepsB = Infinity;
        let positionsB;
        if (!(y === 0 && targetX === 0)) {
            let tmp = state.positions;
            state.positions = positionsB = copyPositions(state.positions);
            stepsB = 0;

            stepsB += directionalMove(state, robotNum + 1, targetX > x ? RIGHT : LEFT, Math.abs(x - targetX));
            stepsB += directionalMove(state, robotNum + 1, targetY > y ? DOWN : UP, Math.abs(y - targetY));
            stepsB += directionalMove(state, robotNum + 1, ACTIVATE, count);

            state.positions = tmp;
        }

        if (stepsA < stepsB) {
            state.positions = positionsA;
        } else {
            state.positions = positionsB;
        }
        
        state.positions[robotNum] = target.slice();

        let steps = Math.min(stepsA, stepsB);

        state.dp[dpIdx] = {
            steps,
            positions: state.positions.slice(robotNum)
        };

        return steps;
    }

}

console.time()
console.log(day21());
console.timeEnd()
