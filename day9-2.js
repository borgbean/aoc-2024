import readInputToLines from "./util/util.js";

export default function day9() {
    let input = readInputToLines('inputs/9.txt')[0].split('').map(Number);

    let gaps = [];
    let offset = 0;
    let numOffsets = [0];

    let result = 0;

    for (let i = 1; i < input.length; i += 2) {
        offset += input[i - 1];
        let gapSize = input[i];
        gaps.push([offset, gapSize]);
        offset += gapSize;
        numOffsets.push(offset);
    }


    let idx = input.length - 1;
    if ((idx % 2) === 1) { --idx; }

    let smallestRejected = Infinity;
    
    while (idx > 0) {
        let trueIdx = Math.floor(idx / 2);

        let needed = input[idx];
        let found = false;

        if(smallestRejected > needed) {
            for(let i = 0; i < gaps.length; ++i) {
                if(gaps[i] === null) { continue; }
                let [offset, size] = gaps[i];
    
                if (offset >= numOffsets[trueIdx]) {  break; }
    
    
                if(size >= needed) {
                    for (let ii = 0; ii < needed; ++ii) {
                        result += (ii + offset) * trueIdx;
                    }
                    if((size-needed) > 0) {
                        gaps[i][0] = offset+needed;
                        gaps[i][1] = size-needed;
    
                    } else {
                        gaps[i] = null;
                    }
    
                    found = true;
                    break;
                }
            }
        }
        if(!found) {
            smallestRejected = Math.min(needed, smallestRejected);
            for (let ii = 0; ii < needed; ++ii) {
                result += (ii + numOffsets[trueIdx]) * trueIdx;
            }
        }
        idx -= 2;
    }

    return result;
}

console.log(day9());
