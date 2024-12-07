import readInputToLines from "./util/util.js";

export default function day7() {
    let input = readInputToLines('inputs/7.txt');

    let dp = new Array(100);
    let sum = 0;
    for(let line of input) {
        let [ansS, numsS] = line.split(': ');
        let ans = Number(ansS);
        let nums = numsS.split(' ').map(Number);

        for(let i = 0; i < nums.length; ++i) {
            dp[i] = 10**Math.ceil(Math.log10(nums[i]+1));
        }
        
        if(possible(ans, nums[0], nums, 1, dp)) {
            sum += ans;
        }
    }

    return sum;

    
}

function possible(ans, result, nums, idx, dp) {
    if(idx >= nums.length) {
        return ans === result;
    }

    if(result > ans) { return false; }

    if(possible(ans, result*nums[idx], nums, idx+1, dp)) { return true; }
    if(possible(ans, result+nums[idx], nums, idx+1, dp)) { return true; }
    if(possible(ans, (result*dp[idx])+nums[idx], nums, idx+1, dp)) { return true; }

}

console.time()
console.log(day7());
console.timeEnd()