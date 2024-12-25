import readInputToLines from "./util/util.js";

export default function day10() {
    let input = readInputToLines('inputs/10.txt');

    let rows = input.length;
    let cols = input[0].length;

    let curVisited = new Array(rows*cols).fill(0);
    let curVisitedIdx = 0;

    let result = 0;
    for(let i = 0; i < rows; ++i) {
        for(let j = 0; j < cols; ++j) {
            if(input[i][j] !== '0') { continue; }
            result += score(i, j);
        }
    }

    return result;

    function score(startI, startJ) {
        let q = [[startI, startJ]];
        let q2 = [];
        let dist = 0;
        let score = 0;

        ++curVisitedIdx;

        while(q.length) {
            let [i, j] = q.pop();

            for(let [i2, j2] of neighbors(i, j)) {
                let dpIdx = i2*cols + j2;
                if(curVisited[dpIdx] === curVisitedIdx || Number(input[i2][j2]) !== (dist+1)) { continue; }
                curVisited[dpIdx] = curVisitedIdx;

                if(dist === 8) {
                    ++score;
                } else {
                    q2.push([i2, j2]);
                }
            }

            if(!q.length) {
                if(dist === 8) { break; }
                [q, q2] = [q2, q];
                ++dist;
            }
        }

        return score;
    }

    function *neighbors(i, j) {
        if(i > 0) {
            yield [i-1, j];
        }
        if(j > 0) {
            yield [i, j-1];
        }
        if(i < (rows-1)) {
            yield [i+1, j];
        }
        if(j < (cols-1)) {
            yield [i, j+1];
        }
    }
}

console.log(day10());