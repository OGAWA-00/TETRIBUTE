const SLOT_TABLE = {
    1: "none",
    2: "LongI",
    3: "Bomb",
    4: "X",
    5: "Fuck",

};

class Slot {
    /**
     * @param {object} symbolDefinitions スロットの各絵柄の定義。キーが絵柄名、値が{resultMino, imagePath}のようなオブジェクト。
     * @param {number} reelsCount リールの数 (デフォルトは3)
     */
    constructor(symbolDefinitions, reelsCount = 3) {
        if (!symbolDefinitions || Object.keys(symbolDefinitions).length === 0) {
            throw new Error("スロットの絵柄定義 (symbolDefinitions) を指定してください。");
        }
        this.symbolDefinitions = symbolDefinitions;
        this.symbols = Object.keys(symbolDefinitions); // 絵柄名のリスト ['Cherry', 'Bell', ...]
        this.reelsCount = reelsCount;
        this.reels = []; // 各リールの現在の絵柄名
        this.isSpinning = false;
        this.winResult = { // 当たった結果を格納
            symbol: null,   // 揃った絵柄名
            minoToSpawn: null // 出現させるミノまたは効果
        };

        this.listeners = {
            'reelsChanged': [], // リールの絵柄が変わった時 (回転中や停止時)
            'slotStopped': []   // スロットが停止し、最終結果が出た時
        };

        this.initializeReels();
    }

    on(eventName, callback) { /* (変更なし) */ }
    emit(eventName, data) { /* (変更なし) */ }

    initializeReels() {
        this.reels = [];
        for (let i = 0; i < this.reelsCount; i++) {
            this.reels.push(this.symbols[Math.floor(Math.random() * this.symbols.length)]);
        }
        // 初期状態を通知
        this.emit('reelsChanged', { reels: this.getDisplayReelsWithInfo(), isSpinning: this.isSpinning });
    }

    spin() {
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.winResult = { symbol: null, minoToSpawn: null }; // 結果をリセット
        console.log("スロット回転");

        let spinDuration = 2000; // 2秒間回転 (仮)
        let intervalTime = 100;  // 0.1秒ごとにリールを更新 (仮)
        let spinCycles = 0;
        const totalSpinCycles = spinDuration / intervalTime;

        const spinningInterval = setInterval(() => {
            for (let i = 0; i < this.reelsCount; i++) {
                this.reels[i] = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            }
            this.emit('reelsChanged', { reels: this.getDisplayReelsWithInfo(), isSpinning: this.isSpinning });

            spinCycles++;
            if (spinCycles >= totalSpinCycles) {
                clearInterval(spinningInterval);
                this.stop();
            }
        }, intervalTime);
    }

    stop() {
        this.isSpinning = false;
        // 最終的な出目を決定 (現在の状態をそのまま採用)
        // もし必要なら、ここで「リーチ目」のような演出のために特定のリールから順に止めるロジックも入れられる

        const winningSymbol = this.checkWin(); // 揃った絵柄の名前を取得
        if (winningSymbol) {
            this.winResult.symbol = winningSymbol;
            this.winResult.minoToSpawn = this.symbolDefinitions[winningSymbol].resultMino;
        }

        console.log("スロット停止 リール:", this.reels, "当たり絵柄:", this.winResult.symbol, "出現ミノ:", this.winResult.minoToSpawn);

        // 最終的なリール状態と結果を通知
        this.emit('reelsChanged', { reels: this.getDisplayReelsWithInfo(), isSpinning: this.isSpinning });
        this.emit('slotStopped', {
            reelsInfo: this.getDisplayReelsWithInfo(),
            winSymbol: this.winResult.symbol,
            minoToSpawn: this.winResult.minoToSpawn
        });
    }

    /**
     * 当たり判定。同じ絵柄が3つ揃ったら、その絵柄の名前を返す。
     * @returns {string|null} 当たった絵柄の名前、またはハズレの場合はnull
     */
    checkWin() {
        if (this.reels.length !== this.reelsCount || this.reelsCount === 0) return null;
        const firstSymbol = this.reels[0];
        if (this.reels.every(symbol => symbol === firstSymbol)) {
            return firstSymbol; // 揃った絵柄の名前
        }
        return null;
    }

    /**
     * 現在の各リールの絵柄名と、それに対応する画像パスなどの情報を配列で返す
     * @returns {object[]} 例: [{name: 'Cherry', imagePath: 'images/slot_cherry.png'}, ...]
     */
    getDisplayReelsWithInfo() {
        return this.reels.map(symbolName => ({
            name: symbolName,
            imagePath: this.symbolDefinitions[symbolName].imagePath
        }));
    }
}