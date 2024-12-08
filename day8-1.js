import readInputToLines from "./util/util.js";

export default function day8() {
    let input = readInputToLines('inputs/8.txt');

    /**
     * @type {Map<string, [number, number][]>}
     */
    let antennaPositions = new Map();

    let rows = input.length;
    let cols = input[0].length;
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
            if (input[i][j] === '.') { continue; }
            if (!antennaPositions.has(input[i][j])) { antennaPositions.set(input[i][j], []); }

            antennaPositions.get(input[i][j]).push([i, j]);
        }
    }

    let antinodes = new Set();


    for (let [symbol, antennas] of antennaPositions) {
        for (let i = 0; i < antennas.length; ++i) {
            let antenna1 = antennas[i];
            for (let j = i + 1; j < antennas.length; ++j) {
                let antenna2 = antennas[j];

                let dI = antenna1[0] - antenna2[0];
                let dJ = antenna1[1] - antenna2[1];

                let candidates = [
                    [antenna1[0] + dI, antenna1[1] + dJ],
                    [antenna2[0] - dI, antenna2[1] - dJ]
                ];

                for (let antinode of candidates) {
                    if (antinode[0] < 0 || antinode[1] < 0 || antinode[0] >= rows || antinode[1] >= cols) { continue; }
                    let d1 = dist(antinode, antenna1);
                    let d2 = dist(antinode, antenna2);
                    if (d1 === (d2 * 2) || (d1 * 2) === d2) {
                        antinodes.add(antinode[0]*rows + antinode[1]);
                    }
                }
            }
        }
    }

    return antinodes.size;

    function dist([i, j], [i2, j2]) {
        return Math.abs(i - i2) + Math.abs(j - j2)
    }
}

console.log(day8());