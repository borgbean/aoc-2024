import { readFileSync } from "fs";
import readInputToLines from "./util/util.js";


export default function day25() {
    let input = readFileSync('inputs/25.txt', 'utf-8').split(/(?:\r?\n){2}/);

    //from above
    let locks = [];

    //from below
    let keys = [];

    let w, h;


    for (let block of input) {
        let lines = block.split(/(?:\r?\n)/);
        w = lines[0].length;
        h = lines.length;

        let isLock = true;
        for (let i = 0; i < lines[0].length; ++i) {
            if (lines[0][i] !== '#') {
                isLock = false;
                break;
            }
        }

        let heights = [];
        for (let i = 0; i < lines[0].length; ++i) {
            let h = lines.length;
            if (isLock) {
                for (let j = 0; j < lines.length; ++j) {
                    if(lines[j][i] !== '#') {
                        h = j-1;
                        break;
                    }
                }
            } else {
                for (let j = lines.length-1; j >= 0; --j) {
                    if(lines[j][i] !== '#') {
                        h = lines.length - (j+2);
                        break;
                    }
                }
            }
            heights.push(h);
        }

        if(isLock) {
            locks.push(heights);
        } else {
            keys.push(heights);
        }

    }

    let matches = 0;
    for(let i = 0; i < locks.length; ++i) {
        for(let j = 0; j < keys.length; ++j) {
            let match = true;
            for(let k = 0; k < locks[i].length; ++k) {
                if((locks[i][k]+keys[j][k]) > (h-2)) {
                    match = false;
                    break;
                }
            }
            if(match) {
                ++matches;
            }
        }
    }

    
    return matches;
}

console.time()
console.log(day25());
console.timeEnd()
