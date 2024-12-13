import {readFileSync} from 'fs';


export default function day13() {
    let input = readFileSync('inputs/13.txt', 'utf-8').split(/(?:\r?\n){2}/);

    let buttonRe = /X\+(\d+), Y\+(\d+)/;
    let prizeRe = /X=(\d+), Y=(\d+)/;

    let ret = 0;

    for(let machine of input) {
        if(machine === '\r\n') { continue; }
        let [a, b, prize] = machine.split(/\r?\n/);

        let buttonA = a.match(buttonRe);
        let x1 = Number(buttonA[1]);
        let y1 = Number(buttonA[2]);
        
        let buttonB = b.match(buttonRe);
        let x2 = Number(buttonB[1]);
        let y2 = Number(buttonB[2]);

        let conditions = prize.match(prizeRe);
        let pX = Number(conditions[1]) + 10000000000000;
        let pY = Number(conditions[2]) + 10000000000000;

        let sol1 = solve(x1, y1, x2, y2, pX, pY, 3, 1);
        let sol2 = solve(x2, y2, x1, y1, pX, pY, 1, 3);

        if(sol1 > 0 && sol2 > 0) {
            ret += Math.min(sol1, sol2);
        } else {
            ret += Math.max(sol1, sol2);
        }
    }

    return ret;


}

console.log(day13());

function solve(x1, y1, x2, y2, pX, pY, costA, costB) {
    let b = (pX*y1-x1*pY)/(y1*x2 - x1*y2)
    let a = (pY-(y2*b))/y1;
    
    if(Math.floor(a) !== a || Math.floor(b) !== b) { return 0; }
    

    return a*costA + b*costB;
}