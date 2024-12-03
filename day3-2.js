import readInputToLines from "./util/util.js";

export default function day3() {
    let input = readInputToLines('inputs/3.txt');

    let re = /(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g;
    let sum = 0;
    let doing = true;
    for(let line of input) {
        let matches = line.match(re);
    
        let re2 = /mul\((\d+),(\d+)\)/;
        for(let match of matches) {
            if(match.startsWith('don\'t')) {
                doing = false;
            } else if(match.startsWith('do')) {
                doing = true;
            } else if(doing) {
                let [_, a, b] = match.match(re2);
                sum += a*b;
            }
        }

    }

    return sum;
}


console.log(day3());