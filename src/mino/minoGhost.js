import { gameState } from '../game/state.js';
import { isValidPosition } from '../field/collision.js';

export function updateGhost() {
    const active = gameState.activeMino;
    if (!active) return;

    let ghostY = active.y;
    while (true) {
        const test = { ...active, y: ghostY + 1 };
        if (isValidPosition(test, gameState.field)) {
        ghostY++;
        } else {
        break;
        }
    }

    gameState.ghostMino = {
        ...active,
        y: ghostY,
    };
}
