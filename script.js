class Board {
    #board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]

    reset() {
        for(let row = 0; row < this.#board.length; row++) {
            for(let col = 0; col < this.#board[row].length; col++) {
                this.#board[row][col] = null
            }
        }
    }

    #isOutOfBounds(row, col) {
        return row < 0 || row >= this.#board.length || col < 0 || col >= this.#board[row].length
    }

    put(row, col, value) {
        if(this.#isOutOfBounds(row, col) || this.#board[row][col] !== null) {
            return false
        }
        this.#board[row][col] = value
        return true
    }

    #isRowEqual(row) {
        return this.#board[row].every(col => col === this.#board[row][0] && col !== null);
    }

    #isColEqual(col) {
        return this.#board.every(row => row[col] === this.#board[0][col] && row[col] !== null)
    }

    #isMainDiagonalEqual() {
        for(let i = 0; i < this.#board.length; i++) {
            if(this.#board[i][i] === null || this.#board[i][i] !== this.#board[0][0]) {
                return false;
            }
        }
        return true;
    }

    #isAntiDiagonalEqual() {
        for(let i = this.#board.length - 1; i >= 0; i--) {
            if(this.#board[this.#board.length - i - 1][i] === null || this.#board[this.#board.length - i - 1][i] !== this.#board[0][this.#board.length - 1]) {
                return false;
            }
        }
        return true
    }

    hasWinner() {
        for(let row = 0; row < this.#board.length; row++) {
            if(this.#isRowEqual(row)) return true
        }
        for(let col = 0; col < this.#board[0].length; col++) {
            if(this.#isColEqual(col)) return true
        }
        if(this.#isMainDiagonalEqual()) return true
        if(this.#isAntiDiagonalEqual()) return true

        return null
    }

    isFull() {
        for(let row = 0; row < this.#board.length; row++) {
            for(let col = 0; col < this.#board[row].length; col++) {
                if(this.#board[row][col] === null) {
                    return false
                }
            }
        }
        return true
    }

    get(row, col) {
        if(this.#isOutOfBounds(row, col)) {
            return null
        }
        return this.#board[row][col]
    }
}

class Player {
    #score = 0
    #name
    #marker

    constructor(name, marker) {
        this.#name = name
        this.#marker = marker
    }

    get score() {
        return this.#score;
    }

    incrementScore() {
        this.#score++
    }

    get marker() {
        return this.#marker
    }

    get name() {
        return this.#name
    }

    set name(name) {
        this.#name = name
    }
}

const GameController = (function() {
    const player1 = new Player('Player 1', 'X')
    const player2 = new Player('Player 2', 'O')
    const board = new Board()
    let currentPlayer = player1
    
    function playTurn(row, col) {
        if(!board.hasWinner()) {
            const validMove = board.put(row, col, currentPlayer.marker)
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
        getCurrentPlayer,
        board
    }
})()

const DomRenderer = (function(gameController) {
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
        gameController.board.reset()
        renderBoard()
    });
    
    function renderBoard() {
        const gameGrid = document.querySelector(".game-grid")
        gameGrid.innerHTML = ""
        highlightCurrentPlayer()
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.textContent = gameController.board.get(row, col);
                cell.classList.add("cell")
                cell.setAttribute("row", row)
                cell.setAttribute("col", col)
                cell.addEventListener("click", event => {
                    const result = gameController.playTurn(row, col)
                    highlightCurrentPlayer()
                    event.target.textContent = gameController.board.get(row, col)
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
        player1Score.textContent = gameController.player1.score
        player2Score.textContent = gameController.player2.score
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
})(GameController)

DomRenderer.renderBoard()
