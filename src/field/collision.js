/**
 * ミノがその位置に置けるかどうかを判定する
 * @param {Object} mino - ミノの状態（x, y, shape）
 * @param {number[][]} field - フィールド（2D配列）
 * @returns {boolean} 有効な位置ならtrue、衝突してたらfalse
 */
export function isValidPosition(mino, field) {
    const { shape, x, y } = mino;
    const rows = field.length;
    const cols = field[0].length;
  
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[dy].length; dx++) {
        const cell = shape[dy][dx];
        if (cell === 0) continue;
  
        const px = x + dx;
        const py = y + dy;
  
        // フィールド外チェック
        if (px < 0 || px >= cols || py >= rows) {
          return false;
        }
  
        // 上にはみ出る分はOK（py < 0）
        if (py >= 0 && field[py][px] !== 0) {
          return false;
        }
      }
    }
  
    return true;
  }
  