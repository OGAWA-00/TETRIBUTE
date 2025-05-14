export const gameState = {
    field: createEmptyField(),
    activeMino: null,
    nextQueue: [],
    holdMino: null,
    ghostMino: null,
    score: 0,
    level: 1,
    linesCleared: 0,
    combo: 0,
    status: 'init', // 'init' | 'playing' | 'paused' | 'gameover'
    holdMino: null,
    canHold: true,
    slotCount: 0,
    slotSpin: false
};
  
export function createEmptyField(rows = 22, cols = 10) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
};

export function resetGameState() {
    gameState.field = createEmptyField();
    gameState.activeMino = null;
    gameState.nextQueue = [];
    gameState.holdMino = null;
    gameState.ghostMino = null;
    gameState.score = 0;
    gameState.level = 1;
    gameState.linesCleared = 0;
    gameState.combo = 0;
    gameState.status = 'paused'; // リセット後は停止状態
    holdMino: null,
    gameState.canHold = true;
    gameState.slotCount = 0;
    slotSpin: false;
}
  
  