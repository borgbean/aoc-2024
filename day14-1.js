import readInputToLines from "./util/util.js";

export default function day14() {
    let input = readInputToLines('inputs/14.txt');
    let w = 101;
    let h = 103;


    let quadrantCounts = new Array(4).fill(0);

    let robotRe = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/;
    for(let robotStr of input) {
        let match = robotStr.match(robotRe);

        let x = Number(match[1]);
        let y = Number(match[2]);
        let vX = Number(match[3]);
        let vY = Number(match[4]);

        
        let finalX = (w+((x + vX*100)%w))%w;
        let finalY = (h+((y + vY*100)%h))%h;

        if(finalY === Math.floor(h/2) || finalX === Math.floor(w/2)) { continue; }

        let top = finalY < Math.floor(h/2);
        let left = finalX < Math.floor(w/2);
        if(top && left) {
            quadrantCounts[0] += 1;
        } else if(top && !left) {
            quadrantCounts[1] += 1;
        } else if(!top && left) {
            quadrantCounts[2] += 1;
        } else if(!top && !left) {
            quadrantCounts[3] += 1;
        }
    }

    return quadrantCounts.reduce((acc, x) => acc*x)
}

console.log(day14());
