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


    gaps.reverse();

    let idx = input.length - 1;
    if ((idx % 2) === 1) { --idx; }

    let needed = input[idx];


    while (idx > 0 && gaps.length) {
        let _recycle = gaps.pop();
        let [offset, size] = _recycle;
        let trueIdx = Math.floor(idx / 2);

        if (offset >= numOffsets[trueIdx]) {  break; }
        if (needed > size) {
            for (let i = 0; i < size; ++i) {
                result += (i + offset) * trueIdx;
            }

            needed -= size;
        } else if (needed <= size) {
            for (let i = 0; i < needed; ++i) {
                result += (i + offset) * trueIdx;
            }

            size -= needed;

            if (size > 0) {
                _recycle[0] = offset + needed;
                _recycle[1] = size;
                gaps.push(_recycle);
            }

            idx -= 2;
            if (idx > 0) {
                needed = input[idx];
            }
        }
    }

    {
        let trueIdx = Math.floor(idx / 2);
        let trueOffset = numOffsets[trueIdx];
        for (let i = 0; i < needed; ++i) {
            result += (i + trueOffset) * trueIdx;
        }
    }

    idx -= 2;
    while (idx > 0) {
        let needed = input[idx];
        
        let trueIdx = Math.floor(idx / 2);
        let trueOffset = numOffsets[trueIdx];


        for (let i = 0; i < needed; ++i) {
            result += (i + trueOffset) * trueIdx;
        }

        idx -= 2;
    }


    return result;
}

console.log(day9());