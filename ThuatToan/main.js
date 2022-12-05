var GAMEBOARD = new Array();
const HUMAN_PLAYER = 'X';
const BOT_PLAYER = 'O';
const WIN_TITLE = 'Chiến thắng!';
const LOSE_TITLE = 'Thất bại!';
const DRAW_TITLE = 'Hòa!';
const WIN_COMBO = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

var replayBtn = document.querySelector('.replay');
replayBtn.onclick = replay;

var cells = document.querySelectorAll('.cell');
startGame();

function replay() {
    // xóa màn hình
    document.querySelector('.gameOver').classList.remove('show');
    for(var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('win-row');
    }

    startGame();
}
function startGame() {
    for(var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = ''; // giá trị ban đầu của các ô là rỗng
        cells[i].addEventListener('click', click2cell); // gán sự kiện khi click vào 1 ô nào đó
        GAMEBOARD[i] = i; // GAMEBOARD = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    }
}

function click2cell(cell) {
    if(typeof GAMEBOARD[cell.target.id] === 'number') { // nếu ô đó chưa được đánh
        makeOX(cell.target.id, HUMAN_PLAYER); // đánh nước đi của người chơi

        if(!draw()) {
            makeOX(bestWay(), BOT_PLAYER);
        } else {
            gameOver();
        }
    }
}

function makeOX(location, player) {
    GAMEBOARD[location] = player; // lưu vị trí được đánh vào mảng
    document.getElementById(location).innerHTML = player; // hiển thị nước đi lên màn hình

    let gamewon = checkWin(GAMEBOARD, player);
    if(gamewon) {
        gameOver(gamewon); // hiển thị thông báo người chiến thắng
    }
}

function checkWin(board, player) {
    var plays = new Array();
    board.filter((value, index) => {
        if(value === player) {
            plays.push(index);
        }
    }); // lọc các vị trí mà 'player' đã đánh

    var gamewon = null;
    for(var [index, combo] of WIN_COMBO.entries()) {
        var hasWinCombo = combo.every((elem) => {
            return plays.indexOf(elem) !== -1; // kiểm tra plays có đủ combo để win hay không
        }); // winCombo nhận giá trị true hoặc false
        if(hasWinCombo) {
            gamewon = {index: index, player: player};
            break;
        }
    }

    return gamewon;
}

function gameOver(gamewon) {
    console.log(gamewon);
    if(gamewon) {
        var playerText = gamewon.player === BOT_PLAYER ? LOSE_TITLE : WIN_TITLE;

        document.querySelector('.gameState').innerHTML = playerText;
        document.querySelector('.gameOver').classList.add('show');
        for(var index of WIN_COMBO[gamewon.index]) {
            document.getElementById(index).classList.add('win-row');
        }
    } else {
        document.querySelector('.gameState').innerHTML = DRAW_TITLE;
        document.querySelector('.gameOver').classList.add('show');
    }
}

function draw() {
    if(emptyCell().length === 0) { // nếu không còn ô trống thì trả về true
        return true;
    }

    return false;
}

function emptyCell() {
    return GAMEBOARD.filter((cell) => {
        return typeof cell === 'number';
    });
}

function bestWay() {
    var res = minimax(GAMEBOARD, BOT_PLAYER);
    return res.index;
}

function minimax(board, player, depth = 0) {
    var availableCells = emptyCell();

    // điều kiện dừng
    if(checkWin(board, HUMAN_PLAYER)) {
        return {score: -10, depth: depth}
    } else if(checkWin(board, BOT_PLAYER)) {
        return {score: 10, depth: depth}
    } else if(availableCells.length === 0) {
        return {score: 0, depth: depth}
    }

    // đệ quy
    var moves = new Array();
    for(var i = 0; i < availableCells.length; i++) {
        var move = new Object();
        move.index = board[availableCells[i]]; // lưu lại vị trí sẽ đánh của 'player'
        board[availableCells[i]] = player; // đánh nước đi

        if(player === BOT_PLAYER) {
            var result = minimax(board, HUMAN_PLAYER, depth + 1);
            move.score = result.score;
            move.depth = result.depth;
        } else {
            var result = minimax(board, BOT_PLAYER, depth + 1);
            move.score = result.score;
            move.depth = result.depth;
        }

        board[availableCells[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if(player === BOT_PLAYER) {
        var bestScore = -1000;
        var bestDepth = 9;
        for(var i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestDepth = moves[i].depth;
                bestMove = i;
            } else if(moves[i].score == bestScore && moves[i].depth < bestDepth) {
                bestScore = moves[i].score;
                bestDepth = moves[i].depth;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 1000;
        var bestDepth = 9;
        for(var i = 0; i < moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestDepth = moves[i].depth;
                bestMove = i;
            } else if(moves[i].score == bestScore && moves[i].depth < bestDepth) {
                bestScore = moves[i].score;
                bestDepth = moves[i].depth;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}