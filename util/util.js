import {readFileSync} from 'fs';

export const A_CODE = 'a'.charCodeAt(0);

export function gcd(a, b) {
    if(a < b) { [b, a] = [a, b]; }
    if(b === 0) { return a; }
    return gcd(b, a % b);
}

export function lcm(a, b) { 
    return (a / gcd(a, b)) * b; 
} 


export function arrToTree(arr) {
    let root = {val: arr[0]};
    let q = [root];
    let idx = 1;

    while(idx < arr.length) {
        let node = q.shift();
        if(arr[idx] !== null) {
            q.push(node.left = {val: arr[idx]});
        }
        ++idx;
        if(idx < arr.length && arr[idx] !== null) {
            q.push(node.right = {val: arr[idx]});
        }
        ++idx;
    }


    return root;
}

/**
 * @param {number} n
 * @param {boolean} countOnly
 * @return {number | number[]}
 */

export function primes(n, countOnly) {
    if(n < 2) {
        if(countOnly) { return 0; }
        return [];
    }
    
    let primeCount = 1;
    let primes = [2];
    
    let realSegmentLength = Math.floor(Math.sqrt(n));

    let maxPrimeToKeep = countOnly ? realSegmentLength : Infinity;
    
    
    let sieveSegment = new Int8Array(Math.ceil(realSegmentLength/2));
    

    for (let segmentStart = 3; segmentStart < n; segmentStart += realSegmentLength) {//only consider odds
        segmentStart |= 1;
        sieveSegment.fill(1);

        //start after 2 - not considering odds
        let primeIdx = 1;
        
        let stillNeedToCheckPrimes = true;
        while(primeIdx < primes.length) {
            if(!fillSieveSegmentUsingPrime(sieveSegment, segmentStart, primes[primeIdx])) {
                stillNeedToCheckPrimes = false;
                break;
            }
            ++primeIdx;
        }
        
        for(let i = 0; i < sieveSegment.length; ++i) {
            if(sieveSegment[i] === 1) {
                let realNumber = segmentStart + i*2;
                if(realNumber >= n) {
                    break;
                }

                ++primeCount;

                //add to primes
                if(realNumber <= maxPrimeToKeep) {
                    primes.push(realNumber);
                }
                if(stillNeedToCheckPrimes && primeIdx < primes.length) {
                    if(!fillSieveSegmentUsingPrime(sieveSegment, segmentStart, primes[primeIdx])) {
                        stillNeedToCheckPrimes = false;
                    }
                    ++primeIdx;
                }
            }
        }
    }

    if(countOnly) {
        return primeCount;
    }
    
    return primes;
};


/**
 *
 * @param {boolean[]} segment
 * @param {number} segmentStart
 * @param {number} prime
 * @return {boolean} true if we did something
 */
function fillSieveSegmentUsingPrime(segment, segmentStart, prime) {
    let sieveStart = prime*prime;

    let start = (sieveStart - segmentStart)>>1;

    if(start >= segment.length) {
        return false;
    }

    if (start < 0) {
        start += prime*Math.ceil(-start/prime);
    }
    
    for (let j = start; j < segment.length; j += prime) {
        segment[j] = 0;
    }

    return true;
}


export default function readInputToLines(filename, skipTrim) {
    let lines = readFileSync(filename, 'utf-8');
    if(!skipTrim) { lines = lines.trim(); }
    return lines.split(/\r?\n/);
}
