import readInputToLines from "./util/util.js";

export default function day2() {
    let input = readInputToLines('inputs/2.txt').map(x => x.split(' ').map(Number));
    
    let safeCount = 0;
    for(let line of input) {
        let safe = doIt(1, line, false);
        if(safe) { ++safeCount; }

    }
    return safeCount;
}

function isIncreasing(line) {
    let increasingCount = 0;
    let decreasingCount = 0;
    for(let i = 1; i < line.length && i < 5; ++i) {
        if((line[i] > line[i-1])) { ++increasingCount }
        else { ++decreasingCount; }
    }
    if(increasingCount === decreasingCount) {
        for(let i = 2; i < line.length && i < 6; ++i) {
            if((line[i] > line[i-2])) { ++increasingCount }
            else { ++decreasingCount; }
        }
        if(increasingCount === decreasingCount) { return true; }
    }

    return increasingCount > decreasingCount;
}

function doIt(i, line, swapped) {
    let increasing = isIncreasing(line, i);

    for(; i < line.length; ++i) {
        let curIncreasing = line[i] > line[i-1];
        let match = true;
        if(curIncreasing !== increasing) {
            match = false;
        }

        let diff = Math.abs(line[i] - line[i-1]);
        if(diff < 1 || diff > 3) {
            match = false;
        }

        if(!match) {
            if(swapped) {
                return false;
            } else {
                //remove this
                let tmp = line[i];
                line[i] = line[i-1];
                if(doIt(i+1, line, true)) { return true; }
                line[i] = tmp;

                //remove prev
                if(i < 2) {
                    return doIt(i+1, line, true);
                } else {
                    let tmp = line[i-1];
                    line[i-1] = line[i-2];
                    let result = doIt(i, line, true);
                    line[i-1] = tmp;
                    return result;
                }
            }
        }
    }

    return true;
}

console.log(day2());