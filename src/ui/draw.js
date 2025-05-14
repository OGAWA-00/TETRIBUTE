import { getBackgroundContext, getFieldContext, getNextContext, getHoldContext, getScoreContext, getSlotContext } from './dom.js';

import { gameState } from '../game/state.js';

import { getMinoShape } from '../mino/minoFactory.js';

const BLOCK_SIZE = 32;
const COLS = 10;
const ROWS = 22;
const GRID_COLOR = '#444';
const BG_COLOR = '#000';

const NEXT_BLOCK_SIZE = 20; // 小さめ表示
const NEXT_OFFSET = 4; // 次ミノ間の余白

const HOLD_WINDOW_WIDTH = 100;
const HOLD_WINDOW_HEIGHT = 100;

const NEXT_WINDOW_WIDTH = 100;
const NEXT_WINDOW_HEIGHT = 300;

const SCORE_WINDOW_WIDTH = 300;
const SCORE_WINDOW_HEIGHT = 100;

const SLOT_WINDOW_WIDTH = 300;
const SLOT_WINDOW_HEIGHT = 390;

const HOLD_POS = {x:20, y:20};
const FIELD_POS = {x:140, y:20};
const NEXT_POS = {x:480, y:20};
const SCORE_POS = {x:140, y:724};
const SLOT_POS = {x:480, y:340};

export const MINO_ID_MAP = {
    I: 1,
    J: 2,
    L: 3,
    O: 4,
    S: 5,
    T: 6,
    Z: 7,
  };

const COLOR_MAP = {
    1: '#00f0f0', // I
    2: '#0000f0', // J
    3: '#f0a000', // L
    4: '#f0f000', // O
    5: '#00f000', // S
    6: '#a000f0', // T
    7: '#f00000', // Z
};

const MINO_FILES = {
    1: "./../../public/assets/images/minos/Imino.jpg", // I
    2: "./../../public/assets/images/minos/Jmino.jpg", // J
    3: "./../../public/assets/images/minos/Lmino.jpg", // L
    4: "./../../public/assets/images/minos/Omino.jpg", // O
    5: "./../../public/assets/images/minos/Smino.jpg", // S
    6: "./../../public/assets/images/minos/Tmino.jpg", // T
    7: "./../../public/assets/images/minos/Zmino.jpg", // Z
};

const MINO_MINO_FILES = {
    1: "./../../public/assets/images/MINIminos/IMINImino.jpg", // I
    2: "./../../public/assets/images/MINIminos/JMINImino.jpg", // J
    3: "./../../public/assets/images/MINIminos/LMINImino.jpg", // L
    4: "./../../public/assets/images/MINIminos/OMINImino.jpg", // O
    5: "./../../public/assets/images/MINIminos/SMINImino.jpg", // S
    6: "./../../public/assets/images/MINIminos/TMINImino.jpg", // T
    7: "./../../public/assets/images/MINIminos/ZMINImino.jpg", // Z
};

const SLOT_FILES = {
    1: "./../../public/assets/images/slot/slot_F.jpg",
    2: "./../../public/assets/images/slot/slot_LI.jpg",
    3: "./../../public/assets/images/slot/slot_X.jpg",
}

const minoImages = {};
const miniMinoImages = {};
const slotImages = {};

export function preloadImages(dict, imageFiles) {
    for (const key in imageFiles) {
        dict[key] = new Image();
        dict[key].src = imageFiles[key];
    }
}

preloadImages(minoImages, MINO_FILES);
preloadImages(miniMinoImages, MINO_MINO_FILES);
preloadImages(slotImages, SLOT_FILES);

export function onBackground(canvas,x,y) {
    const bg = getBackgroundContext();
    bg.drawImage(canvas,x,y);
}

export function drawBackground() {
    const ctx = getBackgroundContext();

    // 背景
    ctx.fillStyle = '#999';
    ctx.fillRect(0, 0, 800, 800);

}

export function drawField() {
    const canvas = getFieldContext();
    const ctx = canvas.getContext('2d');

    // 背景
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

    // グリッド
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        ctx.stroke();
    }
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
    }

    // フィールド描画
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const value = gameState.field[y][x];
            if (value !== 0) {
                const image = minoImages[value];
                ctx.drawImage(image, x * BLOCK_SIZE, y * BLOCK_SIZE);
                // ctx.fillStyle = COLOR_MAP[value] || '#888'; // 未定義ID用に灰色
                // ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
    onBackground(canvas,FIELD_POS.x,FIELD_POS.y);
}

export function drawMino() {
    const canvas = getFieldContext();
    const ctx = canvas.getContext('2d');
    const { activeMino } = gameState;
    if (!activeMino) return;
  
    const { shape, x, y, type } = activeMino;
    const id = MINO_ID_MAP[type];
    ctx.fillStyle = COLOR_MAP[id] || '#888';

    shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
            if (cell) {
                const image = minoImages[id];
                ctx.drawImage(image, (x + dx) * BLOCK_SIZE, (y + dy) * BLOCK_SIZE,);
            }
        });
    });
    onBackground(canvas,FIELD_POS.x,FIELD_POS.y);
}

export function drawGhost() {
    const ctx = getFieldContext().getContext('2d');
    const { ghostMino } = gameState;
    if (!ghostMino) return;
  
    const { shape, x, y, type } = ghostMino;
    const id = MINO_ID_MAP[type];
    ctx.fillStyle = COLOR_MAP[id] + '55'; // 半透明（#xxxxxx55）
  
    shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
            if (cell) {
            ctx.fillRect((x + dx) * BLOCK_SIZE, (y + dy) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

export function drawNextQueue() {
    const canvas = getNextContext();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 背景
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, NEXT_WINDOW_WIDTH, NEXT_WINDOW_HEIGHT);
  
    gameState.nextQueue.slice(0, 7).forEach((type, index) => {
        const shape = getMinoShape(type);
        const id = MINO_ID_MAP[type];
        const color = COLOR_MAP[id] || '#888';
    
        const offsetY = index * (NEXT_BLOCK_SIZE * 3 + NEXT_OFFSET); // 間隔調整
        ctx.fillStyle = color;
    
        shape.forEach((row, dy) => {
            row.forEach((cell, dx) => {
                if (cell) {
                    const image = miniMinoImages[id];
                    ctx.drawImage(image,
                        (NEXT_WINDOW_WIDTH - shape[0].length * NEXT_BLOCK_SIZE)/2 + dx * NEXT_BLOCK_SIZE,
                        offsetY + dy * NEXT_BLOCK_SIZE
                    );
                }
            });
        });
    });
    onBackground(canvas,NEXT_POS.x,NEXT_POS.y);
}

export function drawHold() {
    const canvas = getHoldContext();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 背景
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, HOLD_WINDOW_WIDTH, HOLD_WINDOW_HEIGHT);
  
    const type = gameState.holdMino;
    if (type) {
  
        const shape = getMinoShape(type);
        const id = MINO_ID_MAP[type];
        ctx.fillStyle = COLOR_MAP[id] || '#888';
    
        shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
            if (cell) {
                const image = miniMinoImages[id];
                ctx.drawImage(image,
                    (HOLD_WINDOW_WIDTH - shape[0].length * NEXT_BLOCK_SIZE)/2 + dx * NEXT_BLOCK_SIZE,
                    (HOLD_WINDOW_HEIGHT - shape.length * NEXT_BLOCK_SIZE)/2 + dy * NEXT_BLOCK_SIZE,
                );
            }
        });
        });
    ;}
    onBackground(canvas,HOLD_POS.x,HOLD_POS.y);
}

export function drawScore() {
    const canvas = getScoreContext();
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#999";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#000';
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillText(gameState.score, canvas.width/2, canvas.height/2);

    onBackground(canvas,SCORE_POS.x,SCORE_POS.y);
}

export function drawSlot() {
    const canvas = getSlotContext();
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, SLOT_WINDOW_WIDTH, SLOT_WINDOW_HEIGHT);

    //リールエリア仮置き
    ctx.fillStyle = "gray";
    ctx.fillRect(15, 75, 270, 180);

    ctx.fillStyle = "#f00000";
    ctx.fillRect( 15, 120, 90, 90);
    ctx.fillStyle = "#00f000";
    ctx.fillRect(105, 120, 90, 90);
    ctx.fillStyle = "#0000f0";
    ctx.fillRect(195, 120, 90, 90);

    // 各リールの絵柄を描画
    const image = slotImages[1];
    ctx.drawImage(image,  15,120);
    ctx.drawImage(image, 105,120);
    ctx.drawImage(image, 195,120);

    

    onBackground(canvas,SLOT_POS.x,SLOT_POS.y);
}