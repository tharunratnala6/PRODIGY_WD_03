let boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;

// Initialize game board
let board = Array(9).fill("");

// Add event listeners for user clicks
boxes.forEach((box, index) => {
    box.innerHTML = "";
    box.addEventListener("click", () => {
        if (!isGameOver && board[index] === "") {
            board[index] = turn;
            box.innerHTML = turn;
            checkWin();
            checkDraw();
            if (!isGameOver) {
                changeTurn();
                if (turn === "O") {
                    setTimeout(() => aiMove(), 500); // AI makes its move
                }
            }
        }
    });
});

function changeTurn() {
    turn = turn === "X" ? "O" : "X";
    document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";
}

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = `${turn} wins!`;
            document.querySelector("#play-again").style.display = "inline";
            condition.forEach(i => {
                boxes[i].style.backgroundColor = "#08D9D6";
                boxes[i].style.color = "#000";
            });
            return;
        }
    }
}

function checkDraw() {
    if (!isGameOver && board.every(cell => cell !== "")) {
        isGameOver = true;
        document.querySelector("#results").innerHTML = "It's a draw!";
        document.querySelector("#play-again").style.display = "inline";
    }
}

function aiMove() {
    const bestMove = findBestMove();
    if (bestMove !== -1) {
        board[bestMove] = turn;
        boxes[bestMove].innerHTML = turn;
        checkWin();
        checkDraw();
        if (!isGameOver) changeTurn();
    }
}

// Minimax Algorithm for AI Decision-Making
function minimax(isMaximizing) {
    const winner = evaluateBoard();
    if (winner) return winner === "X" ? -1 : winner === "O" ? 1 : 0;

    if (board.every(cell => cell !== "")) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = isMaximizing ? "O" : "X";
            let score = minimax(!isMaximizing);
            board[i] = "";
            bestScore = isMaximizing
                ? Math.max(score, bestScore)
                : Math.min(score, bestScore);
        }
    }
    return bestScore;
}

function findBestMove() {
    let bestMove = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function evaluateBoard() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

document.querySelector("#play-again").addEventListener("click", () => {
    isGameOver = false;
    turn = "X";
    board = Array(9).fill("");
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";
    boxes.forEach(box => {
        box.innerHTML = "";
        box.style.removeProperty("background-color");
        box.style.color = "#000";
    });
});
