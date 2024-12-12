import readInputToLines from "./util/util.js";

export default function day12() {
    let input = readInputToLines('inputs/12.txt').map(x => x.split(''));

    let result = 0;
    let num = 0;
    for(let i = 0; i < input.length; ++i) {
        for(let j = 0; j < input[0].length; ++j) {
            result += bfs(i, j, num++);
        }
    }

    return result;

    function bfs(startI, startJ, groupNum) {
        let group = input[startI][startJ];
        if(typeof group !== 'string') { return 0; }
        let s = [[startI, startJ]];

        input[startI][startJ] = groupNum;

        let p = 0;
        let a = 0;

        while(s.length) {
            let [i, j] = s.pop();

            ++a;
            let nCount = 0;

            for(let [i2, j2] of neighbors(i, j)) {
                ++nCount;
                if(input[i2][j2] === groupNum) { continue; }
                if(typeof input[i2][j2] === 'number') { ++p; continue; }
                if(input[i2][j2] !== group) { ++p; continue; }

                input[i2][j2] = groupNum;
                s.push([i2, j2]);
            }
            p += 4 - nCount;
        }
        return p*a;
    }

    
    function *neighbors(i, j) {
        if(i > 0) {
            yield [i-1, j];
        }
        if(j > 0) {
            yield [i, j-1];
        }
        if(i < (input.length-1)) {
            yield [i+1, j];
        }
        if(j < (input[0].length-1)) {
            yield [i, j+1];
        }
    }
}

console.log(day12());