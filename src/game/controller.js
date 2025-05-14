import { on } from '../eventBus.js';

import { gameState, resetGameState } from './state.js';

import { spawnMino } from '../mino/minoFactory.js';
import { rotateLeft, rotateRight } from '../mino/minoRotate.js';
import { moveLeft, moveRight, moveDown, hardDrop } from '../mino/minoMove.js';
import { updateGhost } from '../mino/minoGhost.js';
import { holdMino } from '../mino/minoHold.js';

import { slotStart, slotStop } from '../slot/slot.js';

import { drawField, drawMino, drawGhost, drawNextQueue, drawHold, drawScore, drawStartSlot, drawStopSlot } from '../ui/draw.js';

export function setupController() {
    on('move', ({ direction }) => {
        if (gameState.status !== 'playing') return;
        switch (direction) {
        case 'left':
            moveLeft();
            break;
        case 'right':
            moveRight();
            break;
        case 'down':
            moveDown();
            break;
        }
        updateGhost();
        drawField();
        drawGhost();
        drawMino();
        drawNextQueue();
    });
}

on('hardDrop', () => {
    if (gameState.status !== 'playing') return;
    hardDrop();
    updateGhost();
    drawField();
    drawGhost();
    drawMino();
    drawNextQueue();
});

on('rotate', ({ direction }) => {
    if (gameState.status !== 'playing') return;
    if (direction === 'left') rotateLeft();
    if (direction === 'right') rotateRight();
    updateGhost();
    drawField();
    drawGhost();
    drawMino();
    drawNextQueue();
});

on('hold', () => {
    if (gameState.status !== 'playing') return;
    holdMino();
    drawField();
    drawGhost();
    drawMino();
  });

on('togglePause', () => {
    if (gameState.status === 'playing') {
      gameState.status = 'paused';
    } else if (gameState.status === 'paused' || gameState.status === 'init') {
      gameState.status = 'playing';
    }
});
  
on('resetGame', () => {
    resetGameState();
    spawnMino();
    drawScore();
    drawField();
    drawGhost();
    drawMino();
    drawHold();
    drawNextQueue();
});

on('tick', () => {
    moveDown();
    drawScore();
    drawField();
    drawGhost();
    drawMino();
    drawNextQueue();
    if (gameState.slotSpin) {drawStartSlot();}
});

on('startSlot', () => {
    slotStart();
});

on('stopSlot', () => {
    slotStop();
    drawStopSlot();
});
  