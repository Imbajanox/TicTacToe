function createPlayer (name, marker) {
    return { name, marker };
}

function gameboard () {
  
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
} 

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

    return { playRound, getCurrentPlayer };
}


//Test Game

const player1 = createPlayer('Player 1', 'X');
const player2 = createPlayer('Player 2', 'O');

const board = gameboard();

const game = gameController(player1, player2, board);

console.log(game.playRound(0));
console.log(game.playRound(1));
console.log(game.playRound(4));
console.log(game.playRound(2));
console.log(game.playRound(8));