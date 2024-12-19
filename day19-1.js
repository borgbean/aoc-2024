import readInputToLines from "./util/util.js";

export default function day19() {
    let input = readInputToLines('inputs/19.txt');

    let available = new Set(input[0].split(', '));

    let count = 0;
    for(let i = 2; i < input.length; ++i) {
        count += dfs(input[i], 0) ? 1 : 0;
    }

    return count;

    function dfs(pattern, start) {
        if(start >= pattern.length) { return true; }
        for(let i = pattern.length; i >= start; --i) {
            if(available.has(pattern.substring(start, i)) && dfs(pattern, i)) {
                return true;
            }
        }

        return false;
    }
}

console.time()
console.log(day19());
console.timeEnd()
