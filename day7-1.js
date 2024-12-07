import readInputToLines from "./util/util.js";

export default function day7() {
    let input = readInputToLines('inputs/7.txt');

    let sum = 0;
    for(let line of input) {
        let [ansS, numsS] = line.split(': ');
        let ans = Number(ansS);
        let nums = numsS.split(' ').map(Number);
        
        if(possible(ans, nums[0], nums, 1)) {
            sum += ans;
        }
    }


    function possible(ans, result, nums, idx) {
        if(idx >= nums.length) {
            return ans === result;
        }

        if(result > ans) { return false; }

        if(possible(ans, result*nums[idx], nums, idx+1)) { return true; }
        if(possible(ans, result+nums[idx], nums, idx+1)) { return true; }
    }

    return sum;
}


console.log(day7());