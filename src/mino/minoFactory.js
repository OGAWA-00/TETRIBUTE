import { isValidPosition } from '../field/collision.js';

import { gameState } from '../game/state.js';

export const MINO_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

const MINO_SHAPES = {
    I: [[1, 1, 1, 1]],
    O: [
        [4, 4],
        [4, 4],
    ],
    T: [
        [0, 6, 0],
        [6, 6, 6],
    ],
    S: [
        [0, 5, 5],
        [5, 5, 0],
    ],
    Z: [
        [7, 7, 0],
        [0, 7, 7],
    ],
    J: [
        [2, 0, 0],
        [2, 2, 2],
    ],
    L: [
        [0, 0, 3],
        [3, 3, 3],
    ],
};

export function generate7Bag() {
    const bag = [...MINO_TYPES];
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
}

export function getMinoShape(type) {
    return MINO_SHAPES[type];
}

export function spawnMino() {
    if (gameState.nextQueue.length < 7) {
      const bag = generate7Bag();
      gameState.nextQueue.push(...bag);
    }
  
    const type = gameState.nextQueue.shift();
    const shape = getMinoShape(type);
    let spawnX = 3;
    if (shape[0].length === 2 ){
        spawnX = 4;
    } else {
        spawnX = 3;
    };
    const newMino = {
        type,
        shape,
        x: spawnX,
        y: 0,
    };
  
    if (!isValidPosition(newMino, gameState.field)) {
        gameState.status = 'gameover'; // 即停止
        return;
    }
  
    gameState.activeMino = newMino;
    gameState.canHold = true;
  }