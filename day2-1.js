import readInputToLines from "./util/util.js";

export default function day2() {
    let input = readInputToLines('inputs/2.txt').map(x => x.split(' ').map(Number));
    
    let safeCount = 0;
    for(let line of input) {
        let increasing = line[1] > line[0];
        let safe = true;
        for(let i = 1; i < line.length; ++i) {
            let nextIncreasing = line[i] > line[i-1];
            if(nextIncreasing !== increasing) {
                safe = false;
                break;
            }
            let diff = Math.abs(line[i] - line[i-1]);
            if(diff < 1 || diff > 3) {
                safe = false;
                break;
            }
        }
        if(safe) { ++safeCount; }
    }
    
    return safeCount;
}


console.log(day2());