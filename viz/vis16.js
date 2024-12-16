let DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]]

function* day16(rawInput) {
    let input = rawInput.split('\n').map(x => x.split(''));


    let startX, startY, endX, endY;
    for(let i = 0; i < input.length; ++i) {
        for(let j = 0; j < input.length; ++j) {
            if(input[i][j] === 'S') {
                startX = j;
                startY = i;
            } else if(input[i][j] === 'E') {
                endX = j;
                endY = i;
            }
        }
    }


    let seen = new Array(input.length*input[0].length*4).fill(null);
    let h = new MinHeapMap([], 0, true, cmp, false);

    seen[startY*input[0].length*4 + startX*4 + 1] = [0, []];
    //cost, x, y, direction
    h.push([0, startX, startY, 1]);
    let bestCost = Infinity;
    while(h.size) {
        let [cost, x, y, direction] = h.pop();


        let startDpIdx = y*input[0].length*4 + x*4 + direction;

        yield ['PATHFINDING', input.length, input[0].length, input, seen];

        if(x === endX && y === endY) {
            if((cost) > bestCost) {
                break;
            }
            bestCost = cost;
        }

        //l, r
        for(let dir of [(DIRECTIONS.length+(direction - 1))%DIRECTIONS.length, (DIRECTIONS.length+(direction + 1))%DIRECTIONS.length]) {
            let dpIdx = y*input[0].length*4 + x*4 + dir;
            let newCost = cost + 1000;
            if(seen[dpIdx] && seen[dpIdx][0] < newCost) {  continue; }

            let wasSeen = !!seen[dpIdx];

            seen[dpIdx] ||= [newCost, []];
            seen[dpIdx][1].push(startDpIdx);


            if(!wasSeen) {
                h.push([cost + 1000, x, y, dir]);
            }
        }

        //forwards
        {
            let newY = DIRECTIONS[direction][0] + y;
            let newX = DIRECTIONS[direction][1] + x;
            let dpIdx = newY*input[0].length*4 + newX*4 + direction;
            let newCost = cost + 1;
            if(input[newY][newX] === '#') { continue; }
            if(seen[dpIdx] && seen[dpIdx][0] < newCost) {  continue; }
            //danger danger danger! we might have already marked something off, even though this is a better path
            if(seen[dpIdx] && seen[dpIdx][0] > newCost) { seen[dpIdx] = null; }

            let wasSeen = !!seen[dpIdx];


            seen[dpIdx] ||= [newCost, []];
            seen[dpIdx][1].push(startDpIdx);
            
            if(!wasSeen) {
                h.push([cost+1, newX, newY, direction]);
            }
        }
        
    }


    let finalDpIdx = endY*input[0].length*4 + endX*4;
    let minEnding = Infinity;
    for(let i = 0; i < 4; ++i) {
        if(!seen[finalDpIdx+i]) { continue; }
        minEnding = Math.min(minEnding, seen[finalDpIdx][0]);
    }

    let bestPathEligible = new Array(input.length*input[0].length).fill(0);
    let count = 0;


    for(let i = 0; i < 4; ++i) {
        if(seen[finalDpIdx+i] && seen[finalDpIdx+i][0] === minEnding) {
            yield* dfs(finalDpIdx+i);
        }
    }

    function *dfs(dpIdx) {
        let realIdx = Math.floor(dpIdx/4);
        
        if(!bestPathEligible[realIdx]) { ++count; }
        bestPathEligible[realIdx] = true;

        yield ['BACKTRACKING', input.length, input[0].length, input, bestPathEligible];

        let toCheck = seen[dpIdx][1];
        seen[dpIdx][1] = [];
        for(let inIdx of toCheck) {
            yield *dfs(inIdx);
        }
    }

    
    function cmp(a, b) {
        return a[0] - b[0];
    }
}




function drawFrame(ctxt, width, height, rawData, drawState) {
    let [renderMode, rows, cols, originalInput, data] = rawData;
    drawState.renderMode = renderMode;
    if(!drawState.initialized) {
        drawState.initialized = true;


        let squareW = width/cols;
        let squareH = height/rows;

        drawState.rows = rows;
        drawState.cols = cols;
        drawState.squareW = squareW;
        drawState.squareH = squareH;
        drawState.originalInput = originalInput;
        drawState.characterSizes = new Map();

    }

    ctxt.fillStyle = 'black';
    ctxt.fillRect(0, 0, width, height);



    for(let i = 0; i < drawState.rows; ++i) {
        for(let j = 0; j < drawState.cols; ++j) {
            let color;
            let text = drawState.originalInput[i][j];

            switch(text) {
                case '#':
                    color = 'red';
                    break;
                case 'E':
                    color = 'green';
                    break;
                case 'S':
                    color = 'green';
                    break;
                case '.':
                    color = 'black';
                    break;
            }
            ctxt.fillStyle = color;

            ctxt.fillRect(drawState.squareW*j, drawState.squareH*i, drawState.squareW, drawState.squareH);

            ctxt.fillStyle = 'yellow';
            if(drawState.renderMode === 'PATHFINDING') {
                for(let dir = 0; dir < 4; ++dir) {
                    let dpIdx = drawState.cols*4*i + 4*j + dir;
                    if(data[dpIdx]) {
                        drawTriangle(ctxt, drawState.squareW*j, drawState.squareH*i, drawState.squareW, drawState.squareH, dir);
                    }
                }
            } else {
                let dpIdx = drawState.cols*i +j;

                if(data[dpIdx]) {
                    let text = '✅';
                    ctxt.font = `${drawState.squareW*.7}px Consolas`;
                    ctxt.textBaseline = 'top';
    
                    let [charW, charH, leftOffset, topOffset] = getCharacterSize(text);
                    ctxt.fillText(text, drawState.squareW*j + drawState.squareW/2 - charW/2, drawState.squareH*i + drawState.squareH/2 - charH/2 + topOffset);
                }
            }

        }

        function drawTriangle(ctxt, x, y, w, h, dir) {
            ctxt.beginPath();
            ctxt.fillStyle = 'yellow';

            ctxt.lineTo(x+w/2, y+h/2);
            if(dir === 0) {
                //NORTH
                ctxt.lineTo(x, y);
                ctxt.lineTo(x+w, y);
            } else if(dir === 1) {
                //EAST
                ctxt.lineTo(x+w, y);
                ctxt.lineTo(x+w, y+h);
            } else if(dir === 2) {
                //south
                ctxt.lineTo(x, y+h);
                ctxt.lineTo(x+w, y+h);
            } else if(dir === 3) {
                //west
                ctxt.lineTo(x, y);
                ctxt.lineTo(x, y+h);
            }
            ctxt.fill();
            ctxt.closePath();
        }
    }

    function getCharacterSize(text) {
    if(drawState.characterSizes.has(text)) { return drawState.characterSizes.get(text); }
        let metrics = ctxt.measureText(text);

        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        let width = metrics.width;

        let topOffset = metrics.actualBoundingBoxAscent;
        let leftOffset = metrics.actualBoundingBoxLeft;

        let ret = [width, actualHeight, leftOffset, topOffset];
        drawState.characterSizes.set(text, ret);
        return ret;
    }
}























/**
 * @template T
 */
class MinHeapMap {
    /**
     * @param {T[]} arr 
     * @param {number} size 
     * @param {boolean} alreadyHeapified 
     * @param {function(T, T): number} cmp 
     * @param {boolean} trackPositions 
     */
    constructor(arr, size, alreadyHeapified, cmp, trackPositions) {
        /**
         * @type {any[]}
         */
        this.heap = arr;
        /**
         * @type {number}
         */
        this.size = size;
        /**
         * @type {function(T, T): number}
         */
        this.cmp = cmp;

        if(!alreadyHeapified) {
            this._heapify();
        }

        /**
         * @type {boolean}
         */
        this.trackPositions = trackPositions;
        if(trackPositions) {
            /**
             * @type {Map<T, number>}
             */
            this.idxByElem = new Map();
            for(let i = 0; i < size; ++i) {
                this.idxByElem.set(arr[i], i);
            }
        }
    }

    /**
     * @param {T} val 
     * @returns {boolean}
     */
    has(val) {
        if(!this.trackPositions) { throw new Error('not tracking value positions...'); }
        return this.idxByElem.has(val);
    }
    /**
     * @param {T} oldVal 
     * @param {T} newVal 
     */
    decrease(oldVal, newVal) {
        if(this.cmp(newVal, oldVal) > 0) { throw new Error('improper use of decrease'); }
        if(!this.trackPositions) { throw new Error('not tracking value positions...'); }
        let idx = /** @type {number} */ (this.idxByElem.get(oldVal));
        this.idxByElem.delete(oldVal);
        this.idxByElem.set(newVal, idx);
        this.heap[idx] = newVal;
        
        this._pushUp(idx);
    }
    /**
     * @param {T} oldVal 
     * @param {T} newVal 
     */
    increase(oldVal, newVal) {
        if(this.cmp(newVal, oldVal) < 0) { throw new Error('improper use of decrease'); }
        if(!this.trackPositions) { throw new Error('not tracking value positions...'); }
        let idx = /** @type {number} */ (this.idxByElem.get(oldVal));
        this.idxByElem.delete(oldVal);
        this.idxByElem.set(newVal, idx);
        this.heap[idx] = newVal;

        this._pushDown(idx);
    }
    /**
     * @returns {T}
     */
    peek() {
        if(this.size < 1) { throw new Error('out of bounds'); }

        return this.heap[0];
    }
    /**
     * @returns {T}
     */
    pop() {
        if(this.size < 1) { throw new Error('out of bounds'); }

        let ret = this.heap[0];
        if(this.trackPositions) { this.idxByElem.delete(ret); }
        
        this.size -= 1;
        if(this.size > 0) {
            this.heap[0] = this.heap[this.size];
            if(this.trackPositions) { this.idxByElem.set(this.heap[0], 0); }
            
            this._pushDown(0);
        }

        return ret;
    }
    /**
     * @param {T} e 
     */
    push(e) {
        if((this.heap.length-1) <= this.size) {
            this.heap.length = this.heap.length * 2;
        }
        if(this.trackPositions) { 
            if(this.idxByElem.has(e)) { throw new Error('already had element...'); }
            this.idxByElem.set(e, this.size);
        }
        this.heap[this.size] = e;
        
        this._pushUp(this.size);
        this.size += 1;
    }
    /**
     * @param {number} idx1 
     * @param {number} idx2 
     */
    _swp(idx1, idx2) {
        [this.heap[idx1], this.heap[idx2]] = [this.heap[idx2], this.heap[idx1]];
        if(this.trackPositions) {
            this.idxByElem.set(this.heap[idx1], idx1);
            this.idxByElem.set(this.heap[idx2], idx2);
        }
    }
    /**
     * @param {number} idx 
     */
    _pushUp(idx) {
        while(idx > 0) {
            let p = Math.floor((idx-1)/2);
            
            let cmp = this.cmp(this.heap[idx], this.heap[p]);
            if(cmp < 0) {
                this._swp(idx, p);
                idx = p;
            } else {
                break;
            }
        }
    }
    /**
     * @param {number} idx 
     */
    _pushDown(idx) {
        while(true) {
            let l = idx*2 + 1;
            let r = l + 1;

            if(l >= this.size) { break; }

            let cmpL = this.cmp(this.heap[idx], this.heap[l]);
            let cmpR = -1;
            if(r < this.size) {
                cmpR = this.cmp(this.heap[idx], this.heap[r])
            }

            if(cmpL > 0 && cmpR > 0) {
                let cmpBoth = this.cmp(this.heap[l], this.heap[r]);
                let next = cmpBoth < 0 ? l : r;
                this._swp(idx, next);
                idx = next;
            } else if(cmpL > 0) {
                this._swp(idx, l);
                idx = l;
            } else if(cmpR > 0) {
                this._swp(idx, r);
                idx = r;
            } else {
                break;
            }
        }
    }

    _heapify() {
        for(let i= Math.floor(this.size/2) - 1; i>=0; --i) {
            this._pushDown(i);
        }
    }
}
