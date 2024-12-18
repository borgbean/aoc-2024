import { readFileSync} from 'node:fs';

export default function day17() {
    let input = readFileSync('inputs/17.txt', 'utf-8');

    let registerFile = {
        A: 0,
        B: 0,
        C: 0
    };

    let [regsS, programS] = input.split(/(?:\r?\n){2}/);
    for(let line of regsS.split('\n')) {
        let [_, reg, val] = line.match(/Register (\w+): (\d+)$/);
        registerFile[reg] = Number(val);
    }

    let outputs = [];
    let pc = 0;
    let dataSection = programS.split(': ')[1].split(',').map(Number);
    while(pc < dataSection.length) {
        let [instruction, operand] = [dataSection[pc], dataSection[pc+1]];

        if(instruction === 0) {
            registerFile.A = Math.floor(registerFile.A/2**getCombo(operand));
        } else if(instruction === 1) {
            registerFile.B ^= operand;
        } else if(instruction === 2) {
            registerFile.B = getCombo(operand) % 8;
        } else if(instruction === 3) {
            if(registerFile.A !== 0) {
                pc = operand - 2;
            }
        } else if(instruction === 4) {
            registerFile.B ^= registerFile.C;
        } else if(instruction === 5) {
            outputs.push(getCombo(operand) % 8);
        } else if(instruction === 6) {
            registerFile.B = Math.floor(registerFile.A/2**getCombo(operand));
        } else if(instruction === 7) {
            registerFile.C = Math.floor(registerFile.A/2**getCombo(operand));
        }
        pc += 2;
    }

    return outputs.join(',')


    function getCombo(operand) {
        if(operand <= 3) {
            return operand;
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
