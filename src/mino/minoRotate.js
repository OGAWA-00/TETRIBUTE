import { gameState } from '../game/state.js';
import { isValidPosition } from '../field/collision.js';

const NORMAL_KICK_TABLE = {
    "0>1": [ [0,0], [-1,0], [-1,1], [0,-2], [-1,-2] ],
    "1>2": [ [0,0], [1,0], [1,-1], [0,2], [1,2] ],
    "2>3": [ [0,0], [1,0], [1,1], [0,-2], [1,-2] ],
    "3>0": [ [0,0], [-1,0], [-1,-1], [0,2], [-1,2] ],
    "1>0": [ [0,0], [1,0], [1,1], [0,-2], [1,-2] ],
    "2>1": [ [0,0], [-1,0], [-1,-1], [0,2], [-1,2] ],
    "3>2": [ [0,0], [-1,0], [-1,1], [0,-2], [-1,-2] ],
    "0>3": [ [0,0], [1,0], [1,-1], [0,2], [1,2] ],
};

const I_KICK_TABLE = {
    "0>1": [ [0,0], [-2,0], [1,0], [-2,-1], [1,2], [-3,0] ],
    "1>2": [ [0,0], [-1,0], [2,0], [-1,2], [2,-1], [-3,0]  ],
    "2>3": [ [0,0], [2,0], [-1,0], [2,1], [-1,-2], [-3,0]  ],
    "3>0": [ [0,0], [1,0], [-2,0], [1,-2], [-2,1], [-3,0]  ],
    "1>0": [ [0,0], [2,0], [-1,0], [2,-1], [-1,2], [-3,0]  ],
    "2>1": [ [0,0], [1,0], [-2,0], [1,2], [-2,-1], [-3,0]  ],
    "3>2": [ [0,0], [-2,0], [1,0], [-2,1], [1,-2], [-3,0]  ],
    "0>3": [ [0,0], [-1,0], [2,0], [-1,-2], [2,1], [-3,0]  ],
};

const LI_KICK_TABLE = {
    "0>1": [ [0,0], [-2,0], [1,0], [-2,-1], [1,2], ],
    "1>2": [ [0,0], [-1,0], [2,0], [-1,2], [2,-1], [-5,0]  ],
    "2>3": [ [0,0], [2,0], [-1,0], [2,1], [-1,-2],],
    "3>0": [ [0,0], [1,0], [-2,0], [1,-2], [-2,1], [-4,0]  ],
    "1>0": [ [0,0], [2,0], [-1,0], [2,-1], [-1,2], [-3,0]  ],
    "2>1": [ [0,0], [1,0], [-2,0], [1,2], [-2,-1],],
    "3>2": [ [0,0], [-2,0], [1,0], [-2,1], [1,-2],],
    "0>3": [ [0,0], [-1,0], [2,0], [-1,-2], [2,1], [-3,0]  ],
};

function performRotation(clockwise) {
    const mino = gameState.activeMino;

    const originalRotation = mino.rotation;
    let newRotation;
    if (clockwise) {
        newRotation = (originalRotation + 1) % 4;
    } else {
        newRotation = (originalRotation + 3) % 4; // (originalRotation - 1 + 4) % 4 と同じ
    }

    const rotatedShape = rotateMatrix(mino.shape, clockwise);

    //キックテーブル選択
    let kickTableToUse = (mino.type === 'I') ? I_KICK_TABLE : NORMAL_KICK_TABLE;
    if (mino.type === 'I'){
        kickTableToUse = I_KICK_TABLE;
    } if (mino.type === 'LI'){
        kickTableToUse = LI_KICK_TABLE;
    } else {
        kickTableToUse = NORMAL_KICK_TABLE;
    }

    const rotationKey = `${originalRotation}>${newRotation}`;
    const kickOffsets = kickTableToUse[rotationKey];

    if (!kickOffsets) {
        const testMinoNoKick = {
            ...mino,
            shape: rotatedShape,
            rotation: newRotation,
            // x, y は変更なし
        };
        if (isValidPosition(testMinoNoKick, gameState.field)) {
            gameState.activeMino.shape = rotatedShape;
            gameState.activeMino.rotation = newRotation;
            gameState.activeMino.lastKickIndex = -1; // キックなし
            return true;
        }
        return false; // 回転失敗
    }

    //キックオフセット試行
    for (let i = 0; i < kickOffsets.length; i++) {
        const offset = kickOffsets[i];
        const dx = offset[0];
        const dy = offset[1];

        const testMino = {
            ...mino,
            shape: rotatedShape,
            x: mino.x + dx,
            y: mino.y + dy,
            rotation: newRotation
        };

        if (isValidPosition(testMino, gameState.field)) {
            gameState.activeMino.shape = rotatedShape;
            gameState.activeMino.rotation = newRotation;
            gameState.activeMino.x = testMino.x;
            gameState.activeMino.y = testMino.y;
            gameState.activeMino.lastKickIndex = i; // どのキックテストで成功した
            return true;
        }
    }
    return false; // 全てのキックテストで失敗
}

function rotateMatrix(matrix, clockwise = true) {
    const N = matrix.length;
    const M = matrix[0].length;
    const result = Array.from({ length: M }, () => Array(N).fill(0));

    for (let y = 0; y < N; y++) {
        for (let x = 0; x < M; x++) {
        if (clockwise) {
            result[x][N - 1 - y] = matrix[y][x];
        } else {
            result[M - 1 - x][y] = matrix[y][x];
        }
        }
    }
    return result;
}

export function rotateLeft() {
    const success = performRotation(false);
    gameState.lastMove = success;
    return success;
}

export function rotateRight() {
    const success = performRotation(true);
    gameState.lastMove = success;
    return success;
}


export function checkTSpin() {
    const mino = gameState.activeMino;

    if (!gameState.lastMove) return false;

    if (!mino || mino.type !== 'T') {
        return false; // Tミノでない場合はT-Spinではない
    }

    const centerX = mino.x + 1;
    const centerY = mino.y + 1;

    // Tミノの四隅の相対座標 (中心(0,0)からのオフセット)
    // A(左前), B(右前), C(左後), D(右後) のようなイメージ
    const cornerRelativeCoords = [
        { dx: -1, dy: -1 }, // 左上
        { dx:  1, dy: -1 }, // 右上
        { dx: -1, dy:  1 }, // 左下
        { dx:  1, dy:  1 }  // 右下
    ];

    let filledCorners = 0;
    // Tミノの向きに応じて「前面」となるコーナーが変わる
    // 前面2つ、後面2つを特定
    let frontCornersFilled = 0;
    let isPointAFilled = false; // (centerX - 1, centerY - 1) に対応する角
    let isPointBFilled = false; // (centerX + 1, centerY - 1) に対応する角

    for (let i = 0; i < cornerRelativeCoords.length; i++) {
        const coord = cornerRelativeCoords[i];
        const checkX = centerX + coord.dx;
        const checkY = centerY + coord.dy;

        // フィールドの範囲外か、ブロックで埋まっているかを確認
        // (gameState.field の0が空、0以外がブロックと仮定)
        if (checkX < 0 || checkX >= gameState.field[0].length ||
            checkY < 0 || checkY >= gameState.field.length ||
            gameState.field[checkY][checkX] !== 0) {
            filledCorners++;
            // 向き0（凸が上）の場合の前面コーナーA, Bに相当するかチェック
            if (mino.rotation === 0) {
                if (coord.dx === -1 && coord.dy === -1) isPointAFilled = true;
                if (coord.dx ===  1 && coord.dy === -1) isPointBFilled = true;
            }
            // TODO: 他の向きの場合の「前面コーナー」も同様に判定できると、より正確なMini/Full判定に繋がる
        }
    }

    if (filledCorners >= 3) {
        // 3つ以上のコーナーが埋まっていれば、T-Spinの可能性が高い
        // ここからMiniかFullかを判定するロジックを追加できる
        // 例えば、SRSのルールでは、Tミノが特定のキック(インデックス4)で成功した場合や、
        // "T-Slot" にはまった場合などがFull T-Spinの条件になる。
        // 今回は、まず3コーナー埋まっていれば "T-Spin" とする。

        // 例：向き0のTミノで、前面コーナー(AとB)が両方埋まっていればより"強い"T-Spinと見なせる
        if (mino.rotation === 0 && isPointAFilled && isPointBFilled) {
             console.log("T-Spin detected (Strong, 3+ corners, front corners filled)");
             return true; // "Full T-Spin" の可能性が高い
        }
        // それ以外でも3コーナー埋まっていればT-Spin
        return true;
    }

    return false;
}