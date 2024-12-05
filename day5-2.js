import readInputToLines from "./util/util.js";

export default function day5() {
    let input = readInputToLines('inputs/5.txt');

    let rules = input.filter(x => x.includes('|')).map(x => x.split('|').map(Number));
    let prints = input.filter(x => x.includes(',')).map(x => x.split(',').map(Number));

    let adjList = [];
    let adjListIn = [];

    for(let [v1, v2] of rules) {
        if(!(v1 in adjList)) {
            adjList[v1] = new Set();
            adjListIn[v1] = new Set();
        }
        if(!(v2 in adjList)) {
            adjList[v2] = new Set();
            adjListIn[v2] = new Set();
        }
        adjList[v1].add(v2);
        adjListIn[v2].add(v1);
    }

    let sum = 0;
    for(let print of prints) {
        if(!isMatch(adjList, print)) {
            let vertices = new Set(print);
            let inDegrees = [];

            for(let v1 of print) {
                inDegrees[v1] = 0;
                for(let v0 of adjListIn[v1]) {
                    if(vertices.has(v0)) {
                        inDegrees[v1] += 1;
                    }
                }
            }

            let out = [];
            let q = [];
            for(let v0 in inDegrees) {
                v0 = Number(v0);
                if(inDegrees[v0] === 0) {
                    q.push(v0);
                }
            }
            while(q.length) {
                let v1 = q.pop();
                out.push(v1);

                for(let v2 of adjList[v1]) {
                    if(--inDegrees[v2] === 0) {
                        q.push(v2);
                    }
                }
            }

            sum += out[Math.floor(out.length/2)];
        }
    }

    return sum;


}

function isMatch(adjList, print) {
    let visited = new Set();
    for(let v1 of print) {
        visited.add(v1);
        for(let v2 of adjList[v1]) {
            if(visited.has(v2)) {
                return false;
            }
        }
    }
    return true;
}

console.log(day5());