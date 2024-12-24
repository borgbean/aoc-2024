import { readFileSync } from "fs";
import readInputToLines from "./util/util.js";


const OP_PRETTY = new Map([
    ['OR', 'V'],
    ['AND', 'A'],
    ['XOR', 'X']
]);
export default function day24() {
    let input = readFileSync('inputs/24.txt', 'utf-8');
    // let input = readInputToLines('inputs/24.sample.txt');

    let [inputsS, ops] = input.split(/(?:\r?\n){2}/)

    let adjList2 = {};

    for(let line of ops.split(/\r?\n/)) {
        let [v, output] = line.split(' -> ');

        let [_, v0, op, v1] = v.match(/(\w+) (\w+) (\w+)/);

        let operation = [v0, op, v1];

        adjList2[output] = operation;

        if(output.startsWith('z') && op !== 'XOR') { console.log(output) }
        if(output.startsWith('y') && op === 'OR') { console.log('>>' + output) }

    }

    let [definitelyBroken, maybeBrokenMap] = getBreakages();
    let maybeBrokenArr = [...maybeBrokenMap.keys()];
    let definitelyBrokenIndexes = [...definitelyBroken].map(x => maybeBrokenArr.findIndex(z => z === x));

    console.log(...maybeBrokenMap.entries())
    console.log(definitelyBroken)
    console.log(maybeBrokenMap)

    let usedUp = new Set();

    // let result = dfs(`cvp,mkk,qbw,wcb,wjb,z10,z14,z34`.split(','), new Set());
    let result = dfs(maybeBrokenArr, new Set());
    return result.sort().join(',');

    function dfs(maybeBroken, used) {
        if(used.size === 8) {
            for(let shouldBe of definitelyBrokenIndexes) {
                if(!used.has(shouldBe)) {
                    return false;
                }
            }
            let [_, maybeBroken2] = getBreakages();
            if(!maybeBroken2.size) {
                return [...used].map(x => maybeBroken[x]);
            }
            // console.log(maybeBroken2.size)
            return false;
        }
        let startSize = used.size
        for(let i = 0; i < maybeBroken.length; ++i) {
            // if(usedUp.has(i)) { continue; }
            // if(used.size === 0) { usedUp.add(i) }
            if(used.has(i)) { continue; }
            used.add(i);
            for(let j = i+1; j < maybeBroken.length; ++j) {
                if(used.has(j)) { continue; }
                used.add(j);

                let v1 = maybeBroken[i];
                let v2 = maybeBroken[j];

                let tmp = adjList2[v1];
                let tmp2 = adjList2[v2];
                adjList2[v1] = tmp2;
                adjList2[v2] = tmp;
                if(!tmp || !tmp2) debugger;

                let ret = dfs(maybeBroken, used)
                if(ret) {
                    return ret;
                }

                
                adjList2[v2] = tmp2;
                adjList2[v1] = tmp;

                used.delete(j);
            }
            used.delete(i);
        }
    }

    function getBreakages() {
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
            let v = `z${i.toString().padStart(2, '0')}`;
            if(!adjList2[v]) { break; }

            function derive(v0, num) {
                //expected: XOR(XOR(n), NEXT)
                if(num < 1) {
                    //TODO
                    return;
                }

                let next = adjList2[v0];
                if(next[1] !== 'XOR') {
                    // console.log(`broke -1 -->${v0}<--:..... (${i})`);
                    maybeBroken(v0);
                    return;
                }
                let [v1, op, v2] = next;
                if(!adjList2[v1] || !adjList2[v2]) {
                    // throw new Error('not hit...')
                    // console.log(`broke 0 -->${v0}<--:${v1}-${v2} (${i})`);
                    maybeBroken(v0, v1, v2);
                    return;
                }
                if(adjList2[v2][1] === 'XOR') {
                    [v1, v2] = [v2, v1];
                }
                if(adjList2[v1][1] !== 'XOR') {
                    // console.log(`broke 2 -->${v0}<--:${v1}-${v2} (${i})`);
                    maybeBroken(v1, v2);//TODO not sure which?!
                    // maybeBroken(v0);
                    return;
                }
                if(adjList2[v2][1] === 'XOR') {
                    // console.log(`broke 3 -->${v0}<--:${v1}-${v2} (${i})`);
                    maybeBroken(v1, v2);//TODO not sure which?!
                    return;
                }
                if(adjList2[v2][1] !== 'OR') {
                    // throw new Error('not hit...')

                    // console.log(`broke 4 -->${v0}<--:${v1}-${v2} (${i})`);
                    // maybeBroken(v0, v1, v2);
                    maybeBroken(v2);
                    return;
                }
                
                let xor1 = adjList2[v1];
                if(!xor1[0].includes(num.toString().padStart(2, '0')) || !xor1[2].includes(num.toString().padStart(2, '0'))) {
                    // throw new Error('not hit...')

                    // console.log(`broke 5 -->${v0}<--:${v1}-${v2} (${i})`);
                    maybeBroken(v0, v1, v2);
                    return;
                }

                //XOR OK... NOW FOR CARRY
                deriveCarry(v2, num-1);
            }
            function deriveCarry(v0, num) {
                let [v1, op, v2] = adjList2[v0];

                if(num === 0) { 
                    //TODO
                    return;
                }

                if(isAndFor(v2, num)) {
                    [v2, v1] = [v1, v2];
                }
                if(!isAndFor(v1, num)) {
                    // console.log(`broke 6 -->${v0}<--:${v1}-${v2} (${i})`);
                    maybeBroken(v0, v1, v2);
                    return;
                }

                deriveCarry2(v2, num);
            }
            function isAndFor(v0, num) {
                if(!adjList2[v0]) {
                    maybeBroken(v0);
                    return;
                }
                let [v1, op, v2] = adjList2[v0];
                if(op !== 'AND' || !(
                        v1.includes(num.toString().padStart(2, '0')) &&
                        v2.includes(num.toString().padStart(2, '0')))
                ) {
                    return false;
                }

                return true;
            }
            function isXorFor(v0, num) {
                if(!adjList2[v0]) {
                    maybeBroken(v0);
                    return;
                }
                let [v1, op, v2] = adjList2[v0];
                if(op !== 'XOR' || !(
                        v1.includes(num.toString().padStart(2, '0')) &&
                        v2.includes(num.toString().padStart(2, '0')))
                ) {
                    return false;
                }

                return true;
            }
            function deriveCarry2(v0, num) {
                let [v1, op, v2] = adjList2[v0];
                if(op !== 'AND') {
                    // console.log(`broke 7 -->${v0}<--:${v1}-${v2} (${i})`);
                    maybeBroken(v0, v1, v2);
                    return;
                }

                if(isXorFor(v2, num)) {
                    [v1, v2] = [v2, v1];
                }
                if(!isXorFor(v1, num)) {
                    // console.log(`broke 8 -->${v0}<--:${v1}-${v2} (${i})`);
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
