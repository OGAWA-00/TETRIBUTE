import { emit } from '/src/eventBus.js';

import { gameState } from '/src/game/state.js';

import { getFallInterval } from '/src/game/level.js';

let lastTime = 0;
let dropInterval = 1000; // ms(1秒間隔
let dropAccumulator = 0;

let slotAccumulator = 0;
const slotInterval = 5000;
const slotSpinTime = 3000;

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
    slotAccumulator += delta;

    dropInterval = getFallInterval(gameState.level);
  
    if (dropAccumulator > dropInterval) {
        emit('tick');
        dropAccumulator = 0;
    }

    if (slotAccumulator > slotInterval && gameState.slotCount && !gameState.slotSpin){
        emit('startSlot');
        gameState.slotSpin = true;
        slotAccumulator = 0;
    }

    if (slotAccumulator > slotSpinTime && gameState.slotSpin) {
        emit('stopSlot');
        gameState.slotSpin = false;
        slotAccumulator = 0;
    }
  
    requestAnimationFrame(update);
  }
