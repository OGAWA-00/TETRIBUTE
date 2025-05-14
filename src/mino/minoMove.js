import { spawnMino } from './minoFactory.js';
import { updateGhost } from './minoGhost.js';

import { gameState } from '../game/state.js';

import { isValidPosition } from '../field/collision.js';
import { putMinoOnField, clearLines } from '../field/field.js';

import { addScore } from '../score/score.js';


export function moveLeft() {
    const mino = { ...gameState.activeMino, x: gameState.activeMino.x - 1 };
    if (isValidPosition(mino, gameState.field)) {
        gameState.activeMino.x--;
    }
}

export function moveRight() {
    const mino = { ...gameState.activeMino, x: gameState.activeMino.x + 1 };
    if (isValidPosition(mino, gameState.field)) {
        gameState.activeMino.x++;
    }
}

export function moveDown() {
    const mino = { ...gameState.activeMino, y: gameState.activeMino.y + 1 };
    if (isValidPosition(mino, gameState.field)) {
        gameState.activeMino.y++;
    } else {
        // 動けないなら固定
        putMinoOnField();
        const linesCleared = clearLines();
        addScore({ linesCleared });
        spawnMino();
        updateGhost();
    }
}

export function hardDrop() {
    const mino = gameState.activeMino;
    let testY = mino.y;
    let dropDistance = 0;
  
    // 下に行ける限り落とす
    while (true) {
      const test = { ...mino, y: testY + 1 };
      if (isValidPosition(test, gameState.field)) {
        testY++;
      } else {
        break;
      }
    }
  
    mino.y = testY;
    
    putMinoOnField();
    const linesCleared = clearLines();
    addScore({ dropDistance, dropType: 'hard' });
    spawnMino();
    updateGhost();
  }
