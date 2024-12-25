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
        
        if(possible(ans, nums[0], nums, 1, dp) === true) {
            sum += ans;
        }
    }

    return sum;

    
}

function possible(ans, result, nums, idx, dp) {
    if(idx >= nums.length) {
        if(ans > result) {
            return -1;
        }
        return ans === result;
    }

    if(result > ans) { return false; }

    let mult = result*nums[idx];
    let concat = (result*dp[idx])+nums[idx];

    let res = possible(ans, concat, nums, idx+1, dp);
    if(res === -1) {
        return -1;
    }
    if(res === true || possible(ans, mult, nums, idx+1, dp) === true) {
        return true;
    }

    return possible(ans, result+nums[idx], nums, idx+1, dp) === true;
}

console.time()
// for(let i = 0; i < 30; ++i)
console.log(day7());
console.timeEnd()