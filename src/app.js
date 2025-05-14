import { drawBackground, drawField, drawMino, drawGhost,drawNextQueue, drawHold, drawScore, drawSlot } from './ui/draw.js';

import { spawnMino } from './mino/minoFactory.js';
import { updateGhost } from './mino/minoGhost.js';

import { setupInput } from './game/input.js';
import { setupController } from './game/controller.js';
import { startGameLoop } from './game/loop.js';

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
