import { readFileSync } from "fs";

export default function day24() {
    let input = readFileSync('inputs/24.txt', 'utf-8');

    let [inputsS, ops] = input.split(/(?:\r?\n){2}/)

    let adjList = {};

    for(let line of ops.split(/\r?\n/)) {
        let [v, output] = line.split(' -> ');

        let [_, v0, op, v1] = v.match(/(\w+) (\w+) (\w+)/);

        let operation = [v0, op, v1];

        adjList[output] = operation;
    }

    let [definitelyBroken, maybeBrokenMap] = getBreakages(false);
    let maybeBrokenArr = [...maybeBrokenMap.keys()];
    let definitelyBrokenIndexes = [...definitelyBroken].map(x => maybeBrokenArr.findIndex(z => z === x));

    let result = dfs(maybeBrokenArr, new Set(), 0);
    return result.sort().join(',');

    function dfs(maybeBroken, used) {
        if(used.size === 8) {
            for(let idx of definitelyBrokenIndexes) {
                if(!used.has(idx)) {
                    return false;
                }
            }

            let [_, maybeBroken2] = getBreakages(true);
            if(!maybeBroken2.size) {
                return [...used].map(x => maybeBroken[x]);
            }
            return false;
        }
        for(let i = 0; i < maybeBroken.length; ++i) {
            if(!definitelyBrokenIndexes.includes(i) && used.size < definitelyBrokenIndexes.length) { continue; }

            if(used.has(i)) { continue; }
            used.add(i);
            for(let j = i+1; j < maybeBroken.length; ++j) {
                if(used.has(j)) { continue; }
                used.add(j);


                let v1 = maybeBroken[i];
                let v2 = maybeBroken[j];

                let tmp = adjList[v1];
                let tmp2 = adjList[v2];
                adjList[v1] = tmp2;
                adjList[v2] = tmp;

                let ret = dfs(maybeBroken, used);
                if(ret) {
                    return ret;
                }

                
                adjList[v2] = tmp2;
                adjList[v1] = tmp;

                used.delete(j);
            }
            used.delete(i);
        }
    }

    function getBreakages(bailEarly) {
        let definitelyBroken = new Set();
        let maybeBrokenMap = new Map();
        function maybeBroken(...nodes) {
            if(nodes.length < 2) {
                definitelyBroken.add(nodes[0]);
            }
            for(let node of nodes) {
                if(node) {
                    maybeBrokenMap.set(node, (maybeBrokenMap.get(node)??0)+1);
                }
            }
        }
        for(let i = 2; i < 45; ++i) {
            if(maybeBroken.size && bailEarly) {[definitelyBroken, maybeBrokenMap];}

            let v = `z${i.toString().padStart(2, '0')}`;
            if(!adjList[v]) { break; }

            function derive(v0, num) {
                //expected: XOR(XOR(n), NEXT)
                if(num < 1) {
                    //TODO
                    return;
                }

                let next = adjList[v0];
                if(next[1] !== 'XOR') {
                    // console.log(`broke -1 -->${v0}<--:..... (${i})`);
                    maybeBroken(v0);
                    return;
                }
                
                let [v1, op, v2] = next;
                
                if(!adjList[v1] || !adjList[v2]) {
                    return maybeBroken(v0);
                }
                if(adjList[v2][1] === 'XOR') {
                    [v1, v2] = [v2, v1];
                }
                if(adjList[v2][1] !== 'OR') {
                    return maybeBroken(v0, v2);
                }
                if(adjList[v1][1] !== 'XOR') {
                    return maybeBroken(v0, v1, v2);//TODO not sure which?!
                }
                
                if(!isXorFor(v1, num)) {
                    return maybeBroken(v0, v1, v2);
                }

                //XOR OK... NOW FOR CARRY
                deriveCarry(v2, num-1);
            }
            function deriveCarry(v0, num) {
                let [v1, op, v2] = adjList[v0];

                if(num === 0) { 
                    if(isAndFor(v0, num)) {
                        return;
                    }
                    return maybeBroken(v0);
                }

                if(isAndFor(v2, num)) {
                    [v2, v1] = [v1, v2];
                }
                if(!isAndFor(v1, num)) {
                    return maybeBroken(v0, v1, v2);
                }

                deriveCarry2(v2, num);
            }
            function isAndFor(v0, num) {
                if(!adjList[v0]) {
                    maybeBroken(v0);
                    return;
                }
                let [v1, op, v2] = adjList[v0];
                if(op !== 'AND' || !(
                        v1.includes(num.toString().padStart(2, '0')) &&
                        v2.includes(num.toString().padStart(2, '0')))
                ) {
                    return false;
                }

                return true;
            }
            function isXorFor(v0, num) {
                if(!adjList[v0]) {
                    maybeBroken(v0);
                    return;
                }
                let [v1, op, v2] = adjList[v0];
                if(op !== 'XOR' || !(
                        v1.includes(num.toString().padStart(2, '0')) &&
                        v2.includes(num.toString().padStart(2, '0')))
                ) {
                    return false;
                }

                return true;
            }
            function deriveCarry2(v0, num) {
                let [v1, op, v2] = adjList[v0];
                if(op !== 'AND') {
                    return maybeBroken(v0);
                }

                if(isXorFor(v2, num)) {
                    [v1, v2] = [v2, v1];
                }
                if(!isXorFor(v1, num)) {
                    maybeBroken(v0, v1, v2);
                    return;
                }
                deriveCarry(v2, num-1)
            }
            derive(v, i)
        }
        return [definitelyBroken, maybeBrokenMap];   
    }
}

console.time()
console.log(day24());
console.timeEnd()
