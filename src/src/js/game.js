// 起動された時の処理をする関数を定義
window.addEventListener('load', () => {
    // ステージを整える
    initialize();

    // ゲームを開始
    loop();
});

let mode;             // ゲームの現在の状況
let frame;            // ゲームのフレーム数
let combinationCount; // 現在の連鎖数

// 初期化の関数
function initialize() {
    // 画像の初期化
    PuyoImage.initialize();
    // ステージの初期化
    Stage.initialize();
    // ユーザの初期化
    Player.initialize();
    // シーンの初期化
    Score.initialize();
    // スコアの初期化
    mode = 'start';
    // フレーム数の初期化
    frame = 0;
}

function loop() {
    switch(mode) {
        case 'start': 
            mode = 'checkFall';
            break;
        case checkFlall:
            // 落ちているかどうか判定する
            if(Stage.checkFall()) { 
                mode = 'fall';
            } else {
                mode = 'checkErase';
            }

            break;
        case 'fall':
            if(!Stage.fall()) { 
                mode = 'checkErase';
            }

            break;
        case 'checkErase':
            // 消せるか判定
            const eraseInfo = Stage.checkFall(frame);

            if(eraseInfo) {
                mode = 'erasing';
                combinationCount++;

                // 得点を計算する
                Score.calculateScore(combinationCount, eraseInfo.piece, eraseInfo.color);
                Stage.hideZenkeshi();
            } else {
                if(Stage.puyoCount === 0 && combinationCount > 0) {
                    // 全消しの処理
                    Stage.showZenkeshi();
                    Score.addScore(3600);
                }

                combinationCount = 0;
                // 全消し出なければ新しいぷよを生成
                mode = 'newPuyo';
            }

            break;
        case 'erasing':
            if(!Stage.erasing(frame)) {
                // 消し終わったら再度落ちるか判定
                mode = 'checkFall';
            }

            break;
        case 'newPuyo':
            if(!Player.createNewPuyo()) {
                // 新しいぷよが生成できなかったらゲームオーバー
                mode = 'gameOver';
            } else {
                // プレイヤが操作可能なら続ける
                mode = 'playing';
            }

            break;
        case 'playing':
            // プレイヤの操作
            const action = Player.playing(frame);
            mode = action;  // 'playing' or 'moving' or 'rotating' 'fix'
            
            break;
        case 'moving':
            if(!Player.moving()) {
                // 移動が終わったら操作可能になる
                mode = 'playing';
            }

            break;
        case 'rotating':
            if(!Player.rotating(frame)) {
                // 回転が終わったら操作可能になる
                mode = 'playing';
            }

            break;
        case 'fix':
            // 現在の位置でぷよを固定
            Player.fix();
            // 固定したら自由落下をチェック
            mode = 'checkFall';

            break;
        case 'gameOver':
            // ばたんきゅーの準備
            PuyoImage.prepareBatankyu(frame);
            mode = 'batankyu';

            break;
    }

    frame++;
    requestAnimationFrame(loop);  // 1/60秒後に再度loopを呼び出す
}
