import readInputToLines from "./util/util.js";


const EMPTY_LIST = [];

export default function day23() {
    let input = readInputToLines('inputs/23.txt');

    let adjList = {};
    for(let line of input) {
        let [v1, v2] = line.split('-');

        adjList[v1] ||= [];
        adjList[v2] ||= [];

        adjList[v1].push(v2);
        adjList[v2].push(v1);
    }

    let max = [];
    
    for(let v1 of Object.keys(adjList)) {
        let curMax = dfs(v1, 0, [v1])
        if(curMax.length > max.length) {
            max = curMax;
        }
    }
    
    return max.sort().join(',');

    function dfs(v0, i, path) {
        let list = adjList[v0];

        if(i >= list.length) { 
            if(path.length > max.length) {
                return path.slice();
            }
            return EMPTY_LIST;
        }

        let best = path.slice();
        for(; i < list.length; ++i) {
            //include i
            let v2 = list[i];
            let match = true;

            if(v2 < v0) { continue; }

            for(let j = 0; j < path.length; ++j) {
                if(!adjList[path[j]].includes(v2)) { match = false; break; }
            }
            if(!match) { continue; }

            path.push(v2);
            let ret = dfs(v0, i+1, path);
            if(ret.length > best.length) {
                best = ret;
            }
            path.pop();
        }

        return best;
    }
}

console.time()
console.log(day23());
console.timeEnd()
