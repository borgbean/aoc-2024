import readInputToLines from "./util/util.js";

export default function day2() {
    let input = readInputToLines('inputs/1.txt');

    let pairs = input.map(x => x.split(/\s+/).map(Number));

    let listA = pairs.map(x => x[0]);
    let listB = pairs.map(x => x[1]);

    let counts = new Map();
    
    for(let i = 0; i < listA.length; ++i) {
        counts.set(listB[i], (counts.get(listB[i])??0)+1);
    }
    let sum = 0;
    for(let i = 0; i < listA.length; ++i) {
        sum += listA[i]*(counts.get(listA[i])??0);
    }

    return sum;
}


console.log(day2());