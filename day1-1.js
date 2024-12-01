import readInputToLines from "./util/util.js";

export default function day1() {
    let input = readInputToLines('inputs/1.txt');

    let pairs = input.map(x => x.split(/\s+/).map(Number));

    let listA = pairs.map(x => x[0]);
    let listB = pairs.map(x => x[1]);
    listA.sort((a, b) => a-b);
    listB.sort((a, b) => a-b);

    let sum = 0;
    for(let i = 0; i < listA.length; ++i) {
        sum += Math.abs(listA[i]-listB[i]);

    }
    
    return sum;
}


console.log(day1());