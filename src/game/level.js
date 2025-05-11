const GRAVITY_TABLE = [
    800, // 0: 48f
    716, // 1: 43f
    633, // 2: 38f
    550, // 3: 33f
    466, // 4: 28f
    383, // 5: 23f
    300, // 6: 18f
    216, // 7: 13f
    133, // 8: 8f
    100, // 9: 6f
     83, // 10+
     83, // 11
     83, // 12
     83, // 13
     83, // 14
     83, // 15
     83, // 16
     83, // 17
     83, // 18
     83, // 19
     83, // 20
];
  
export function getLevel(totalLinesCleared) {
    return Math.min(Math.floor(totalLinesCleared / 10), 20);
}
  
export function getFallInterval(level) {
    return GRAVITY_TABLE[Math.min(level, GRAVITY_TABLE.length - 1)];
}  