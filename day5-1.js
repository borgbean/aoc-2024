import readInputToLines from "./util/util.js";

export default function day5() {
    let input = readInputToLines('inputs/5.txt');

    let rules = input.filter(x => x.includes('|')).map(x => x.split('|').map(Number));
    let prints = input.filter(x => x.includes(',')).map(x => x.split(',').map(Number));

    let adjList = [];

    for(let [v1, v2] of rules) {
        if(!(v1 in adjList)) {
            adjList[v1] = new Set();
        }
        if(!(v2 in adjList)) {
            adjList[v2] = new Set();
        }
        adjList[v1].add(v2);
    }

    let sum = 0;
    for(let print of prints) {
        if(isMatch(adjList, print)) {
            sum += print[Math.floor(print.length/2)];
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