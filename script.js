const Board = (function() {
    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]

    function reset() {
        for(let row = 0; row < board.length; row++) {
            for(let col = 0; col < board[row].length; col++) {
                board[row][col] = null
            }
        }
    }

    function isOutOfBounds(row, col) {
        return row < 0 || row >= board.length || col < 0 || col >= board[row].length
    }

    function put(row, col, value) {
        if(isOutOfBounds(row, col) || board[row][col] !== null) {
            return false
        }
        board[row][col] = value
        return true
    }

    function isRowEqual(row) {
        return board[row].every(col => col === board[row][0] && col !== null);
    }

    function isColEqual(col) {
        return board.every(row => row[col] === board[0][col] && row[col] !== null)
    }

    function isMainDiagonalEqual() {
        for(let i = 0; i < board.length; i++) {
            if(board[i][i] === null || board[i][i] !== board[0][0]) {
                return false;
            }
        }
        return true;
    }

    function isAntiDiagonalEqual() {
        for(let i = board.length - 1; i >= 0; i--) {
            if(board[board.length - i - 1][i] === null || board[board.length - i - 1][i] !== board[0][board.length - 1]) {
                return false;
            }
        }
        return true
    }

    function hasWinner() {
        for(let row = 0; row < board.length; row++) {
            if(isRowEqual(row)) return true
        }
        for(let col = 0; col < board[0].length; col++) {
            if(isColEqual(col)) return true
        }
        if(isMainDiagonalEqual()) return true
        if(isAntiDiagonalEqual()) return true

        return null
    }

    function isFull() {
        for(let row = 0; row < board.length; row++) {
            for(let col = 0; col < board[row].length; col++) {
                if(board[row][col] === null) {
                    return false
                }
            }
        }
        return true
    }

    function get(row, col) {
        if(isOutOfBounds(row, col)) {
            return null
        }
        return board[row][col]
    }

    return {
        reset,
        put,
        hasWinner,
        isFull,
        get
    }
})()

function createPlayer(name, marker) {
    let score = 0

    function incrementScore() {
        score++;
    }

    function getScore() {
        return score
    }

    function getMarker() {
        return marker
    }

    return {
        name,
        getMarker,
        incrementScore,
        getScore
    }
}

const GameController = (function(board) {
    const player1 = createPlayer('Player 1', 'X')
    const player2 = createPlayer('Player 2', 'O')
    let currentPlayer = player1
    
    function playTurn(row, col) {
        if(!board.hasWinner()) {
            const validMove = board.put(row, col, currentPlayer.getMarker())
            if(validMove) {
                if(board.hasWinner()) {
                    currentPlayer.incrementScore()
                    return `${currentPlayer.name} victory!`
                } else if(board.isFull()) {
                    return "It's a draw!"
                } else {
                    currentPlayer = currentPlayer === player1 ? player2 : player1
                }
            }
        }
    }

    function getCurrentPlayer() {
        return currentPlayer
    }

    return {
        playTurn,
        player1,
        player2,
        getCurrentPlayer
    }
})(Board)

const DomRenderer = (function(board, gameController) {
    const player1SetNameBtn = document.querySelector(".player-1 .set-name-btn").addEventListener("click", event => {
        const newName = prompt("Enter your name:")
        if(newName !== "" && newName !== null) {
            console.log(newName)
            gameController.player1.name = newName
            document.querySelector(".player-1 .name").textContent = newName
        }
    });
    const player2SetNameBtn = document.querySelector(".player-2 .set-name-btn").addEventListener("click", event => {
        const newName = prompt("Enter your name:")
        if(newName !== "" && newName !== null) {
            gameController.player2.name = newName
            document.querySelector(".player-2 .name").textContent = newName
        }
    });
    const resetGameBtn = document.querySelector(".reset-game-btn").addEventListener("click", event => {
        board.reset()
        renderBoard()
    });
    
    function renderBoard() {
        const gameGrid = document.querySelector(".game-grid")
        gameGrid.innerHTML = ""
        highlightCurrentPlayer()
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.textContent = board.get(row, col);
                cell.classList.add("cell")
                cell.setAttribute("row", row)
                cell.setAttribute("col", col)
                cell.addEventListener("click", event => {
                    const result = gameController.playTurn(row, col)
                    highlightCurrentPlayer()
                    event.target.textContent = board.get(row, col)
                    if(result !== undefined) {
                        renderPlayerScore()
                        alert(result)
                    }
                })
                gameGrid.appendChild(cell);
            }
        }
    }

    function renderPlayerScore() {
        const player1Score = document.querySelector(".player-1 .score");
        const player2Score = document.querySelector(".player-2 .score");
        player1Score.textContent = gameController.player1.getScore()
        player2Score.textContent = gameController.player2.getScore()
    }

    function highlightCurrentPlayer() {
        const player1 = document.querySelector(".player-1");
        const player2 = document.querySelector(".player-2");

        if(gameController.getCurrentPlayer() === gameController.player1) {
            player1.style.borderLeftColor = 'orange';
            player2.style.borderLeftColor = 'lightgray'
        } else {
            player1.style.borderLeftColor = 'lightgray';
            player2.style.borderLeftColor = 'orange'
        }
    }

    return {
        renderBoard,
        renderPlayerScore
    }
})(Board, GameController)

DomRenderer.renderBoard()
