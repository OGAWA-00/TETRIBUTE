import { gameState } from '../game/state.js';

import { drawScore } from '../ui/draw.js';

export function addScore({
    linesCleared = 0,
    isTSpin = false,
    dropDistance = 0,
    dropType = null,
}) {
    let base = 0;
    const lv = gameState.level;

    if (isTSpin) {
        switch (linesCleared) {
        case 0:
            base = 100;
            break;
        case 1:
            base = 800;
            break;
        case 2:
            base = 1200;
            break;
        case 3:
            base = 1600;
            break;
        }
    } else {
        switch (linesCleared) {
        case 1:
            base = 100;
            break;
        case 2:
            base = 300;
            break;
        case 3:
            base = 500;
            break;
        case 4:
            base = 800;
            break;
        }
    }

    if (dropType === 'soft') {
        base += dropDistance * 1;
    }
    if (dropType === 'hard') {
        base += dropDistance * 2;
    }

    gameState.score += base * lv;
    drawScore();
}