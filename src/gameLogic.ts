import { randomInt } from 'crypto';

const symbols: string[] = ['A', 'B', 'C', 'D', 'E'];
const paylines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
];

function getRandomSymbol(): string {
    const index = randomInt(0, symbols.length);
    return symbols[index];
}

export async function generateMatrix(): Promise<string[]> {
    const matrix: string[] = [];
    for (let i = 0; i < 9; i++) {
        matrix.push(getRandomSymbol());
    }
    return matrix;
}

export function calculateWinnings(matrix: string[]): number {
    let winnings = 0;
    paylines.forEach(line => {
        if (matrix[line[0]] === matrix[line[1]] && matrix[line[1]] === matrix[line[2]]) {
            winnings += 5;
        }
    });
    return winnings;
}
