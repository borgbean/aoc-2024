import readInputToLines from "./util/util.js";

export default function day11() {
    let input = readInputToLines('inputs/11.txt');

    let initial = input[0].split(' ').map(Number);

    let dp = new Array(25+1).fill(0).map(x => []);
    let result = 0;


    for(let num of initial) {
        result += count(25, num);
    }

    return result;


    function count(i, num) {
        if(i === 0) {
            return 1;
        }

        if(dp[i][num]) { return dp[i][num]; }

        let ret;

        if(num === 0) {
            ret = count(i-1, 1);
        } else {
            let digits = num+'';
            if((digits.length%2) === 0) {
                ret = count(i-1, Number(digits.substring(0, digits.length/2))) 
                        + count(i-1, Number(digits.substring(digits.length/2)));
            } else {
                ret = count(i-1, Number(num*2024));
            }
        }

        dp[i][num] = ret;

        return ret;
    }
}

console.log(day11());