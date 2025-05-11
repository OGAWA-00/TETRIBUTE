import { emit } from '../eventBus.js';

import { gameState } from './state.js';

import { getFallInterval } from './level.js';

let lastTime = 0;
let dropInterval = 1000; // ms（＝1秒間隔）
let dropAccumulator = 0;

export function startGameLoop() {
    requestAnimationFrame(update);
}

function update(timestamp) {
    if (gameState.status !== 'playing') {
        requestAnimationFrame(update);
        return;
    }
  
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    dropAccumulator += delta;
    dropInterval = getFallInterval(gameState.level);
  
    if (dropAccumulator > dropInterval) {
        emit('tick');
        dropAccumulator = 0;
    }
  
    requestAnimationFrame(update);
  }
