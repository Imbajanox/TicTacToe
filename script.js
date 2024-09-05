function createPlayer (name, marker) {
    return { name, marker };
}

const board = (function gameboard () {
  
    const board = ['','','','','','','','',''];

    const setMarker = (index, marker) => {
        if (board[index] === '') {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const getBoard = () => board;

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    return { setMarker, getBoard, resetBoard };
})(); 

function gameController (player1, player2, board) {
    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    };

    const playRound = (index) => {
        if (board.setMarker(index, currentPlayer.marker)) {
            if(checkWin()) {
                return `${currentPlayer.name} wins!`
            } else if (board.getBoard().every(cell => cell !== '')) {
                return "It's a draw!";
            }
            switchPlayer();
        }
    };

    const playWithAI = (index) => {
        let result = game.playRound(index);
        if (result) return result;


        let aiMove = aiPlayer.getMove(board);
        result = game.playRound(aiMove);
        return result;
    };

    const checkWin = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => 
                board.getBoard()[index] === currentPlayer.marker
            )
        );
    }

    const getCurrentPlayer = () => currentPlayer;

    return { playRound, playWithAI, getCurrentPlayer };
}

//AI

const AIPlayer = (marker) => {
    const getMove = (board) => {
        let availableMoves = board.getBoard().map((cell, index) => cell === '' ? index : null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    };

    return {marker, getMove};
};


//Test Game

const player1 = createPlayer('Player 1', 'X');
const aiPlayer = AIPlayer('O');

const game = gameController(player1, aiPlayer, board);



//UI

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const result = game.playWithAI(index);
        e.target.textContent = board.getBoard()[index];

        if(result) {
            alert(result);
            board.resetBoard();
            document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
        }
    })
})