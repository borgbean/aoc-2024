import { readFileSync } from "fs";



export default function day24() {
    let input = readFileSync('inputs/24.txt', 'utf-8');

    let [inputsS, ops] = input.split(/(?:\r?\n){2}/)
    let inputs = new Map();
    for(let line of inputsS.split('\n')) {
        let [v, val] = line.split(': ');
        inputs.set(v, Number(val));
    }

    let waiting = new Map();
    let neededs = new Map();
    let q = [];

    for(let line of ops.split(/\r?\n/)) {
        let [v, output] = line.split(' -> ');

        let [_, v0, op, v1] = v.match(/(\w+) (\w+) (\w+)/);

        let operation = [v0, op, v1, output];


        let needed = 2 - (inputs.has(v0) + inputs.has(v1));
        if(needed > 0) {
            neededs.set(operation, needed);

            for(let vv of [v0, v1]) {
                if(!inputs.has(vv)) {
                    waiting.set(vv, waiting.get(vv) || []);
                    waiting.get(vv).push(operation);
                }
            }
        } else {
            q.push(operation);
        }
    }

    let ret = 0n;
    while(q.length) {
        let [v0, op, v1, output] = q.pop();

        let val;
        if(op === 'XOR') {
            val = inputs.get(v0) ^ inputs.get(v1); 
        } else if(op === 'OR') {
            val = inputs.get(v0) | inputs.get(v1); 
        } else if(op === 'AND') {
            val = inputs.get(v0) & inputs.get(v1); 
        } else {
            throw new Error("no");
        }

        if(output.startsWith('z')) {
            let shift = BigInt(output.substring(1));
            ret = ret | (BigInt(val) << shift);
        }

        inputs.set(output, val);
        for(let operation of waiting.get(output)??[]) {
            neededs.set(operation, neededs.get(operation)-1);
            if(neededs.get(operation) < 1) {
                q.push(operation);
            }
        }
    }
    return ret;
}

console.time()
console.log(day24());
console.timeEnd()
