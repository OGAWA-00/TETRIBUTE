import { gameState } from '../game/state.js';
import { getLevel } from '../game/level.js';

import { addScore } from '../score/score.js';

import { checkTSpin } from '../mino/minoRotate.js';


export function putMinoOnField() {
    const { shape, x, y } = gameState.activeMino;

    shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
            const px = x + dx;
            const py = y + dy;

            if (cell && py >= 0 && py < gameState.field.length && px >= 0 && px < gameState.field[0].length) {
                gameState.field[py][px] = cell;
            }
        });
    });
}

export function clearLines() {
    const newField = gameState.field.filter(row => row.some(cell => cell === 0));
    const linesCleared = gameState.field.length - newField.length;
  
    // 上に空行を追加
    while (newField.length < gameState.field.length) {
        newField.unshift(Array(gameState.field[0].length).fill(0));
    }
  
    gameState.field = newField;
    gameState.linesCleared += linesCleared;
    gameState.level = getLevel(gameState.linesCleared);
    gameState.slotCount += linesCleared;

    const isTSpin = checkTSpin();
    addScore({ linesCleared, isTSpin });
  
    return linesCleared;
}
  