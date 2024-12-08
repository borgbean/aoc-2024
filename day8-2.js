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

                for (let direction of [-1, 1]) {
                    let [ii, jj] = antenna1;
                    while (ii >= 0 && jj >= 0 && ii < rows && jj < cols) {
                        antinodes.add(ii * rows + jj);

                        ii += dI * direction;
                        jj += dJ * direction;
                    }
                }
            }
        }
    }

    return antinodes.size;
}


console.log(day8());