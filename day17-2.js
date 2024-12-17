import { readFileSync} from 'node:fs';

export default function day17() {
    let input = readFileSync('inputs/17.txt', 'utf-8');

    let registerFile = {
        A: BigInt(0),
        B: BigInt(0),
        C: BigInt(0)
    };

    let [regsS, programS] = input.split(/(?:\r?\n){2}/);
    for(let line of regsS.split('\n')) {
        let [_, reg, val] = line.match(/Register (\w+): (\d+)$/);
        registerFile[reg] = Number(val);
    }

    let dataSection = programS.split(': ')[1].split(',').map(Number);

    let initialRegFile = {...registerFile};

    for(let i = 359493309n; i < Infinity; i += 1n<<26n) {
        registerFile = {...initialRegFile};
        registerFile.A = i;

        let outputs = 0;

        let pc = 0;
        while(pc < dataSection.length) {
            let [instruction, operand] = [dataSection[pc], dataSection[pc+1]];
    
            if(instruction === 0) {
                registerFile.A = registerFile.A/2n**getCombo(operand);
            } else if(instruction === 1) {
                registerFile.B ^= BigInt(operand);
            } else if(instruction === 2) {
                registerFile.B = getCombo(operand) % 8n;
            } else if(instruction === 3) {
                if(registerFile.A !== 0) {
                    pc = operand - 2;
                }
            } else if(instruction === 4) {
                registerFile.B ^= registerFile.C;
            } else if(instruction === 5) {
                let val = Number(getCombo(operand) % 8n);
                if(outputs === dataSection.length || dataSection[outputs] !== val) {
                    break;
                }
                ++outputs;
            } else if(instruction === 6) {
                registerFile.B = registerFile.A/2n**getCombo(operand);
            } else if(instruction === 7) {
                registerFile.C = registerFile.A/2n**getCombo(operand);
            }
            pc += 2;
        }
    
        if(outputs === dataSection.length) {
            return i;
        }
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
