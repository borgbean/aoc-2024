import readInputToLines from "./util/util.js";

export default function day12() {
    let input = readInputToLines('inputs/12.txt').map(x => x.split(''));

    let posSideGroups = new Int32Array(input.length*input[0].length*4).fill(-1);

    let result = 0;
    // used to overwrite plants as 'visited' without an extra 'visited' array
    let groupNum = 0;
    for(let i = 0; i < input.length; ++i) {
        for(let j = 0; j < input[0].length; ++j) {
            result += bfs(i, j, groupNum++);
        }
    }

    return result;

    function bfs(startI, startJ, groupNum) {
        let group = input[startI][startJ];
        //already visited?
        if(typeof group !== 'string') { return 0; }

        //visit
        input[startI][startJ] = groupNum;

        let s = [[startI, startJ]];

        let unionFindParents = [];

        let a = 0;
        let sides = 0;

        while(s.length) {
            let [i, j] = s.pop();

            let dpIdx = i*input[0].length*4 + j*4;

            ++a;
            let nCount = 0;

            let dir = -1;
            for(let [i2, j2] of neighbors(i, j)) {
                ++dir;
                if(i2 < 0 || j2 < 0 || i2 >= input.length || j2 >= input[0].length) {
                    //out of bounds so this is a side
                    posSideGroups[dpIdx + dir] = unionFindParents.length;
                    unionFindParents.push(unionFindParents.length);
                    ++sides;
                    continue;
                }
                ++nCount;
                if(input[i2][j2] === groupNum) {
                    continue;
                }
                if(typeof input[i2][j2] === 'number' || input[i2][j2] !== group) { 
                    //not in this group so this is a side
                    posSideGroups[dpIdx + dir] = unionFindParents.length;
                    unionFindParents.push(unionFindParents.length);
                    ++sides;
                    continue;
                }

                input[i2][j2] = groupNum;
                s.push([i2, j2]);
            }


            for(let [i2, j2] of neighbors(i, j)) {
                if(i2 < 0 || j2 < 0 || i2 >= input.length || j2 >= input[0].length) {
                    continue;
                }
                if(input[i2][j2] !== groupNum) {
                    continue;
                }
                
                let dpIdx1 = i*input[0].length*4 + j*4;
                let dpIdx2 = i2*input[0].length*4 + j2*4;
                for(let i = 0; i < 4; ++i) {
                    if(posSideGroups[dpIdx2+i]>=0 && posSideGroups[dpIdx1+i]>=0) {
                        --sides;
                        union(dpIdx+i, dpIdx2+i);
                    }
                }
                
            }

            
        }

        return sides*a;


        function union(idx1, idx2) {
            let root1 = findRoot(idx1);
            let root2 = findRoot(idx2);

            if(root1 === root2) { return; }
            unionFindParents[root1] = root2;
        }

        function findRoot(idx) {
            let group = posSideGroups[idx];

            while(unionFindParents[group] !== group) {
                group = unionFindParents[group];
            }

            return group;
        }
    }

    
    function *neighbors(i, j) {
        yield [i-1, j];
        yield [i, j-1];
        yield [i+1, j];
        yield [i, j+1];
    }
}

console.time()
console.log(day12());
console.timeEnd()