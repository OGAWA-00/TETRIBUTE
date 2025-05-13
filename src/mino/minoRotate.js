import { gameState } from '../game/state.js';
import { isValidPosition } from '../field/collision.js';

const NORMAL_KICK_TABLE = {
    "0>1": [ [0,0], [-1,0], [-1,1], [0,-2], [-1,-2] ],
    "1>2": [ [0,0], [1,0], [1,-1], [0,2], [1,2] ],
    "2>3": [ [0,0], [1,0], [1,1], [0,-2], [1,-2] ],
    "3>0": [ [0,0], [-1,0], [-1,-1], [0,2], [-1,2] ],
    "1>0": [ [0,0], [1,0], [1,1], [0,-2], [1,-2] ],
    "2>1": [ [0,0], [-1,0], [-1,-1], [0,2], [-1,2] ],
    "3>2": [ [0,0], [-1,0], [-1,1], [0,-2], [-1,-2] ],
    "0>3": [ [0,0], [1,0], [1,-1], [0,2], [1,2] ],
};

const I_KICK_TABLE = {
    "0>1": [ [0,0], [-2,0], [1,0], [-2,-1], [1,2] ],
    "1>2": [ [0,0], [-1,0], [2,0], [-1,2], [2,-1] ],
    "2>3": [ [0,0], [2,0], [-1,0], [2,1], [-1,-2] ],
    "3>0": [ [0,0], [1,0], [-2,0], [1,-2], [-2,1] ],
    "1>0": [ [0,0], [2,0], [-1,0], [2,-1], [-1,2] ],
    "2>1": [ [0,0], [1,0], [-2,0], [1,2], [-2,-1] ],
    "3>2": [ [0,0], [-2,0], [1,0], [-2,1], [1,-2] ],
    "0>3": [ [0,0], [-1,0], [2,0], [-1,-2], [2,1] ],
};

function rotateMatrix(matrix, clockwise = true) {
    const N = matrix.length;
    const M = matrix[0].length;
    const result = Array.from({ length: M }, () => Array(N).fill(0));

    for (let y = 0; y < N; y++) {
        for (let x = 0; x < M; x++) {
        if (clockwise) {
            result[x][N - 1 - y] = matrix[y][x];
        } else {
            result[M - 1 - x][y] = matrix[y][x];
        }
        }
    }
    return result;
}

export function rotateLeft() {
    const mino = gameState.activeMino;
    const rotated = rotateMatrix(mino.shape, false);
    const testMino = { ...mino, shape: rotated };
    if (isValidPosition(testMino, gameState.field)) {
        gameState.activeMino.shape = rotated;
    }
}

export function rotateRight() {
    const mino = gameState.activeMino;
    const rotated = rotateMatrix(mino.shape, true);
    const testMino = { ...mino, shape: rotated };
    if (isValidPosition(testMino, gameState.field)) {
        gameState.activeMino.shape = rotated;
    }
}

export function checkTSpin() {
    return false;
}
  