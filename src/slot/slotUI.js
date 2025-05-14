const slotImages = {}; // 読み込んだ画像を格納するオブジェクト
let imagesLoadedCount = 0;
const totalImagesToLoad = Object.keys(slotSymbolDefinitions).length;

function preloadSlotImages(definitions, callback) {
    for (const symbolName in definitions) {
        const def = definitions[symbolName];
        slotImages[symbolName] = new Image();
        slotImages[symbolName].onload = () => {
            imagesLoadedCount++;
            if (imagesLoadedCount === totalImagesToLoad) {
                callback(); // 全ての画像が読み込み終わったらコールバックを実行
            }
        };
        slotImages[symbolName].onerror = () => {
            console.error("画像の読み込みに失敗しました:", def.imagePath);
            imagesLoadedCount++; // エラーでもカウントは進めて、無限待機を避ける
             if (imagesLoadedCount === totalImagesToLoad) {
                callback();
            }
        };
        slotImages[symbolName].src = def.imagePath;
    }
}

// ゲーム開始前に呼び出す
// preloadSlotImages(slotSymbolDefinitions, startGame); // startGameはゲームメインループを開始する関数

// --- draw.js ---
// (getSlotContext, BG_COLOR, SLOT_WINDOW_WIDTH, SLOT_WINDOW_HEIGHT は定義済みとします)

let currentReelSymbolsInfo = []; // Slotクラスから受け取った現在のリール情報

// Slotクラスのイベントを購読して currentReelSymbolsInfo を更新する (これはmain.jsなどで設定)
// slotMachine.on('reelsChanged', (data) => {
//   currentReelSymbolsInfo = data.reels;
//   requestAnimationFrame(drawSlot); // 描画をリクエスト
// });

export function drawSlot() {
    const canvas = getSlotContext(); // これは getCanvasElementById('slot-canvas') のようなものと想定
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 背景描画
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, SLOT_WINDOW_WIDTH, SLOT_WINDOW_HEIGHT);

    // スロットマシン本体の画像を描画 (将来的に)
    // if (slotMachineBodyImage && slotMachineBodyImage.complete) {
    //    ctx.drawImage(slotMachineBodyImage, 0, 0, SLOT_WINDOW_WIDTH, SLOT_WINDOW_HEIGHT);
    // }

    if (currentReelSymbolsInfo.length === 0) {
        // まだリール情報がない場合は何もしないか、初期表示
        ctx.fillStyle = "gray";
        ctx.fillRect(20, 20, SLOT_WINDOW_WIDTH - 40, 50); // 仮のリールエリア
        ctx.fillStyle = "white";
        ctx.fillText("スロット準備中...", 30, 50);
        return;
    }

    // 各リールの絵柄を描画
    const reelWidth = (SLOT_WINDOW_WIDTH * 0.8) / currentReelSymbolsInfo.length; // リール1つあたりの幅 (仮)
    const reelHeight = 80; // リール1つあたりの高さ (仮)
    const spacing = (SLOT_WINDOW_WIDTH * 0.2) / (currentReelSymbolsInfo.length + 1); // リール間のスペース (仮)
    const offsetY = (SLOT_WINDOW_HEIGHT - reelHeight) / 2; // Y方向の中央寄せ (仮)

    currentReelSymbolsInfo.forEach((reelInfo, index) => {
        const imageToDraw = slotImages[reelInfo.name]; // 事前に読み込んだ画像を取得
        const x = spacing + index * (reelWidth + spacing);
        const y = offsetY;

        if (imageToDraw && imageToDraw.complete) {
            // 画像が読み込み完了していれば描画
            // ctx.drawImage(imageToDraw, x, y); // 元のサイズで描画
            ctx.drawImage(imageToDraw, x, y, reelWidth, reelHeight); // サイズを指定して描画
        } else {
            // 画像がまだor失敗なら代替表示
            ctx.fillStyle = "lightgray";
            ctx.fillRect(x, y, reelWidth, reelHeight);
            ctx.fillStyle = "black";
            ctx.fillText(reelInfo.name, x + 10, y + 20);
        }
    });

    // TODO: ここに「当たり」のラインや、スロットマシン自体の枠などを描画する処理を追加
}