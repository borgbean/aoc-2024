import { readFileSync} from 'node:fs';

export default function day17() {
    let input = readFileSync('inputs/17.txt', 'utf-8');

    let registerFile = {
        A: BigInt(0),
        B: BigInt(0),
        C: BigInt(0)
    };

    let [regsS, programS] = input.split(/(?:\r?\n){2}/);
    for(let line of regsS.split(/\r?\n/)) {
        let [_, reg, val] = line.match(/Register (\w+): (\d+)$/);
        registerFile[reg] = Number(val);
    }

    let dataSection = programS.split(': ')[1].split(',').map(Number);

    return dfs(0n, 0);

    function dfs(curNum, i) {
        if(i >= dataSection.length) { return curNum; }

        let curPow = 3n;
        for(let ii = 0n; ii < 8n; ++ii) {
            let tmp = (curNum<<curPow) + ii;

            let b = (tmp & 7n) ^ 1n;
            let c = tmp / (2n**b);
            let b2 = b ^ c ^ 5n;
            let out = b2 & 7n
            let num = Number(out);
            if(num === dataSection.at(-1 - i)) {
                let ret = dfs(tmp, i+1);
                if(ret !== false) { return ret; }
            }
        }
        return false;
    }

    function getCombo(operand) {
        if(operand <= 3) {
            return BigInt(operand);
        } else if(operand === 4) {
            return registerFile.A;
        } else if(operand === 5) {
            return registerFile.B;
        } else if(operand === 6) {
            return registerFile.C;
        } else {
            throw new Error('uhoh');
        }
    }


}

console.time()
console.log(day17());
console.timeEnd()
