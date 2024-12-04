import readInputToLines from "./util/util.js";

let DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [-1, 1], [1, -1]];

export default function day4() {
    let input = readInputToLines('inputs/4.txt');
    let rows = input.length;
    let cols = input[0].length;
    let count = 0;

    for(let i = 0; i < rows; ++i) {
        for(let j = 0; j < cols; ++j) {
            for(let [iOff, jOff] of DIRECTIONS) {
                if(matchesXmas(input, i, j, iOff, jOff)) {
                    ++count;
                }
            }
        }
    }

    return count;
}

let XMAS = 'XMAS';
function matchesXmas(input, i, j, iOff, jOff) {
    for(let idx = 0; idx < XMAS.length; ++idx) {
        if(i < 0 || j < 0 || i >= input.length || j >= input[0].length) { return false; }

        if(input[i][j] !== XMAS[idx]) { return false; }
        i += iOff;
        j += jOff;
    }

    return true;
}

console.log(day4());