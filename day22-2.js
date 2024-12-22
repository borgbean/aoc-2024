import readInputToLines from "./util/util.js";

const MASK = (1<<24)-1

export default function day22() {
    let input = readInputToLines('inputs/22.txt');

    let dp = new Uint32Array(104976);
    let dp2 = new Uint16Array(104976);

    let lineNo = 0;
    for(let secretNumS of input) {
        ++lineNo;
        let secretNum = secretNumS;

        let prevSalePrice = null;
        let prevSalePrices = [];
        let prevSalePriceIdx = 0;

        for(let i = 0; i < 2000; ++i) {
            secretNum = (secretNum ^ secretNum<<6) & MASK;
            secretNum = (secretNum ^ secretNum>>>5); //don't technically need to mask here
            secretNum = (secretNum ^ secretNum<<11) & MASK;

            let sellPrice = secretNum % 10;

            if(prevSalePrice !== null) {
                prevSalePrices[prevSalePriceIdx++] = sellPrice-prevSalePrice;
                prevSalePriceIdx = prevSalePriceIdx%4;
            }

            prevSalePrice = sellPrice;

            if(prevSalePrices.length >= 4) {
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
    for(let i = 0; i < sellPrices.length; ++i) {
        idx += base*(sellPrices[(i + ringBufStart) % sellPrices.length]+9);
        base *= 19;
    }

    return idx;
}


console.time()
console.log(day22());
console.timeEnd()
