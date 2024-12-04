import readInputToLines from "./util/util.js";


export default function day4() {
    let input = readInputToLines('inputs/4.txt');
    let rows = input.length;
    let cols = input[0].length;
    let count = 0;

    for(let i = 0; i < rows; ++i) {
        for(let j = 0; j < cols; ++j) {
            if(matchesXmas(input, i, j)) {
                ++count;
            }
        }
    }

    return count;
}

function matchesXmas(input, i, j) {
    if((i + 1) >= input.length || (j+1) >= input[0].length || j < 1 || i < 1) { return false; }

    if(input[i][j] !== 'A') { return false; }

    if(!((
        input[i-1][j-1] === 'M' &&
        input[i+1][j+1] === 'S'
    ) || 
    (
        input[i-1][j-1] === 'S' &&
        input[i+1][j+1] === 'M'
    )
    )) { return false; }

    
    if(!((
        input[i-1][j+1] === 'M' &&
        input[i+1][j-1] === 'S'
    ) || 
    (
        input[i-1][j+1] === 'S' &&
        input[i+1][j-1] === 'M'
    )
    )) { return false; }

    return true;
}

console.log(day4());