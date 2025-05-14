import { drawBackground, drawField, drawMino, drawGhost,drawNextQueue, drawHold, drawScore, drawSlot } from '/src/ui/draw.js';

import { spawnMino } from '/src/mino/minoFactory.js';
import { updateGhost } from '/src/mino/minoGhost.js';

import { setupInput } from '/src/game/input.js';
import { setupController } from '/src/game/controller.js';
import { startGameLoop } from '/src/game/loop.js';

window.addEventListener('DOMContentLoaded', () => {
    setupInput();
    setupController();

    spawnMino();
    updateGhost();

    drawBackground();
    drawGhost();
    drawHold();
    drawField();
    drawMino();
    drawNextQueue();
    drawScore();
    drawSlot();
 
    startGameLoop();
});
