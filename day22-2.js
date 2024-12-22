import readInputToLines from "./util/util.js";

const MASK = (1<<24)-1

export default function day22() {
    let input = readInputToLines('inputs/22.txt');

    let dp = new Uint32Array(19**4);
    let dp2 = new Uint16Array(19**4);
    let prevSalePrices = new Int16Array(4);

    let lineNo = 0;
    for(let secretNumS of input) {
        ++lineNo;
        let secretNum = Number(secretNumS);

        let prevSalePrice = null;
        let prevSalePriceIdx = 0;

        for(let i = 0; i < 2000; ++i) {
            secretNum = (secretNum ^ secretNum<<6) & MASK;
            secretNum = (secretNum ^ secretNum>>>5); //don't technically need to mask here
            secretNum = (secretNum ^ secretNum<<11) & MASK;

            let sellPrice = secretNum % 10;

            if(i > 0) {
                prevSalePrices[prevSalePriceIdx] = sellPrice-prevSalePrice;
                prevSalePriceIdx = ++prevSalePriceIdx&3;
            }

            prevSalePrice = sellPrice;

            if(i >= 4) {
                let dpIdx = getDpIdx(prevSalePrices, prevSalePriceIdx);
                
                if(dp2[dpIdx] !== lineNo) {
                    dp[dpIdx] = dp[dpIdx] || 0;
                    dp[dpIdx] += sellPrice;
                    dp2[dpIdx] = lineNo;
                }
            }
        }
    }

    let max = 0;
    for(let val of dp) {
        if(val > max) {
            max = val;
        }
    }

    return max;
}

function getDpIdx(sellPrices, ringBufStart) {
    let idx = 0;
    let base = 1;
    for(let i = 0; i < 4; ++i) {
        idx += base*(sellPrices[(i + ringBufStart) & 3]+9);
        base *= 19;
    }

    return idx;
}


console.time()
console.log(day22());
console.timeEnd()
