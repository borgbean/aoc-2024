import readInputToLines from "./util/util.js";



export default function day22() {
    let input = readInputToLines('inputs/22.txt');

    let result = 0n;
    for(let secretNumS of input) {
        let secretNum = BigInt(secretNumS);

        for(let i = 0; i < 2000; ++i) {
            secretNum = prune(mix(secretNum, secretNum*64n));
            secretNum = prune(mix(secretNum, secretNum / 32n));
            secretNum = prune(mix(secretNum, secretNum*2048n));
        }

        result += secretNum;
    }

    return result;
}

function mix(a, b) {
    return a ^ b;
}
function prune(a) {
    return a % 16777216n;
}

console.time()
console.log(day22());
console.timeEnd()
