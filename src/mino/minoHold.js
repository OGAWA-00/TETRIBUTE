import { gameState } from '/src/game/state.js';

import { spawnMino, getMinoShape } from '/src/mino/minoFactory.js';
import { updateGhost } from '/src/mino/minoGhost.js';

import { drawHold, drawNextQueue } from '/src/ui/draw.js';

export function holdMino() {
    if (!gameState.canHold) return;

    const current = gameState.activeMino.type;
    const held = gameState.holdMino;

    gameState.canHold = false;

    if (!held) {
        // 初回ホールド：今のミノをholdに入れて、新しいミノをspawn
        gameState.holdMino = current;
        spawnMino();
    } else {
        // 2回目以降：入れ替え
        gameState.holdMino = current;
        const shape = getMinoShape(held);
        gameState.activeMino = {
        type: held,
        shape,
        x: 3,
        y: 0,
        };
    }

    updateGhost();
    drawNextQueue();
    drawHold();
}
