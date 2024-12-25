import readInputToLines from "./util/util.js";

const MASK = (1<<24)-1

export default function day22() {
    let input = readInputToLines('inputs/22.txt');


    let result = 0;
    for(let secretNumS of input) {
        let secretNum = Number(secretNumS);

        for(let i = 0; i < 2000; ++i) {
            secretNum = (secretNum ^ secretNum<<6) & MASK;
            secretNum = (secretNum ^ secretNum>>>5); //don't technically need to mask here
            secretNum = (secretNum ^ secretNum<<11) & MASK;
        }
        result += secretNum;
    }


    return result;
}


console.time()
console.log(day22());
console.timeEnd()
