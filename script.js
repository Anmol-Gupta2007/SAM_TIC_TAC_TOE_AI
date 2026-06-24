const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");

const HUMAN = "X";
const AI = "O";

let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let winningCells = [];

// Create Board
function createBoard() {

    boardElement.innerHTML = "";

    board.forEach((cell, index) => {

        const cellElement = document.createElement("div");

        cellElement.classList.add("cell");

        cellElement.textContent = cell;

        if (cell === "X") {
            cellElement.classList.add("x");
        }

        if (cell === "O") {
            cellElement.classList.add("o");
        }

        if (winningCells.includes(index)) {
            cellElement.classList.add("winner");
        }

        cellElement.addEventListener("click", () => playerMove(index));

        boardElement.appendChild(cellElement);

    });

}

// Player Move
function playerMove(index) {

    if (board[index] !== "" || gameOver) return;

    board[index] = HUMAN;

    updateBoard();

    if (checkWinner(board, HUMAN)) {

        endGame("🎉 You Win!");

        return;
    }

    if (isBoardFull(board)) {

        endGame("🤝 Draw!");

        return;
    }

    statusElement.textContent = "🤖 AI Thinking...";

    setTimeout(aiMove, 300);

}

// AI Move
function aiMove() {

    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {

            board[i] = AI;

            let score = minimax(board, 0, false);

            board[i] = "";

            if (score > bestScore) {

                bestScore = score;
                move = i;

            }

        }

    }

    board[move] = AI;

    updateBoard();

    if (checkWinner(board, AI)) {

        endGame("🤖 AI Wins!");

        return;

    }

    if (isBoardFull(board)) {

        endGame("🤝 Draw!");

        return;

    }

    statusElement.textContent = "Your Turn (X)";

}

// Minimax Algorithm
function minimax(currentBoard, depth, isMaximizing) {

    if (checkWinnerMini(currentBoard, AI))
        return 10 - depth;

    if (checkWinnerMini(currentBoard, HUMAN))
        return depth - 10;

    if (isBoardFull(currentBoard))
        return 0;

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < currentBoard.length; i++) {

            if (currentBoard[i] === "") {

                currentBoard[i] = AI;

                let score = minimax(currentBoard, depth + 1, false);

                currentBoard[i] = "";

                bestScore = Math.max(bestScore, score);

            }

        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < currentBoard.length; i++) {

            if (currentBoard[i] === "") {

                currentBoard[i] = HUMAN;

                let score = minimax(currentBoard, depth + 1, true);

                currentBoard[i] = "";

                bestScore = Math.min(bestScore, score);

            }

        }

        return bestScore;

    }

}

// Check Winner (Stores winning cells)
function checkWinner(boardState, player) {

    const patterns = [

        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]

    ];

    for (let pattern of patterns) {

        if (pattern.every(index => boardState[index] === player)) {

            winningCells = pattern;

            return true;

        }

    }

    return false;

}

// Used by Minimax only
function checkWinnerMini(boardState, player) {

    const patterns = [

        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]

    ];

    return patterns.some(pattern =>
        pattern.every(index => boardState[index] === player)
    );

}

// Draw Check
function isBoardFull(boardState) {

    return boardState.every(cell => cell !== "");

}

// Update Board
function updateBoard() {

    createBoard();

}

// End Game
function endGame(message) {

    gameOver = true;

    statusElement.textContent = message;

    // Wait 2 seconds before restarting
    setTimeout(() => {

        restartGame();

    }, 2000);

}

// Restart Game
function restartGame() {

    board = ["", "", "", "", "", "", "", "", ""];

    winningCells = [];

    gameOver = false;

    statusElement.textContent = "Your Turn (X)";

    createBoard();

}

// Start Game
createBoard();
