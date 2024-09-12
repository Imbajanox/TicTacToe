function createPlayer (name, marker, score) {
    return { name, marker, score };
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
    let rounds = 0;
    let currentPlayer = player1;
    let scores = { [player1.name]: 0, [player2.name]: 0};

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    };

    const playRound = (index) => {
        if (board.getBoard()[index] === '') {

            board.setMarker(index, currentPlayer.marker);
            updateUI();


            if(checkWin()) {
                currentPlayer.score += 10;
                rounds++;
                setPlayedRounds(rounds);
                setResult(true, currentPlayer.name);
                return `${currentPlayer.name} wins!`;
            } else if (board.getBoard().every(cell => cell !== '')) {
                setResult(false, currentPlayer.name);
                rounds++;
                setPlayedRounds(rounds);
                return "It's a draw!";
            }
            console.log("Played round with" + currentPlayer.name)
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

//AI

const AIPlayer = (marker, score) => {
    const getMove = (board) => {
        let availableMoves = board.getBoard().map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        if(availableMoves.length > 0){
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        return null;
    };

    return {marker, score, getMove};
};


//Test Game

const player1 = createPlayer('Player 1', 'X', 0);
const aiPlayer = AIPlayer('O', 0);

const game = gameController(player1, aiPlayer, board);

const playWithAI = (index) => {
    let result = game.playRound(index);
    updateUI();
    setScores(player1.score, aiPlayer.score);
    if (result) {
        for (let i = 0; i < board.getBoard().length; i++) {
            console.log(board.getBoard()[i]);
        }
        console.log(result);

        return result;
    }


    let aiMove = aiPlayer.getMove(board);
    result = game.playRound(aiMove);
    updateUI();
    setScores(player1.score, aiPlayer.score);
    if (result) {
        console.log(result);
        //alert(result);
        
    }

    return result;
};

//UI

const setScores = (score1, score2) => {
    const playerScore = document.querySelector('.playerScore');
    const aiScore = document.querySelector('.aiScore');

    playerScore.textContent = `Player: ${score1} Points`;
    aiScore.textContent = `AI: ${score2} Points`;
}

const updateUI = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = board.getBoard()[index];
    });
};

const setPlayedRounds = (numberOfRounds = 0) => {
    document.querySelector('.numberOfRounds').textContent = `Rounds played: ${numberOfRounds}`;
}

const setResult = (winner = true, player) => {
    if(winner){
        const result = document.querySelector('.result').textContent = `${player} won!`
    }
    else{
        const result = document.querySelector('.result').textContent = `It's a Draw!`
    }
    
};



document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const result = playWithAI(index);
        e.target.textContent = board.getBoard()[index];

        if(result) {
            document.querySelector('.newRoundBtn').disabled = false;
            document.querySelector('.newRoundBtn').addEventListener('click', () => {
                board.resetBoard();
                document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
                document.querySelector('.result').textContent = 'wait for result...';
                document.querySelector('.newRoundBtn').disabled = true;
            })
            //board.resetBoard();
            //setTimeout(() => {document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');}, 5000);
            //setTimeout(() => {document.querySelector('.result').textContent = 'wait for result...';}, 5000);
            
        } else {
            const aiMove = board.getBoard().findIndex(cell => cell === aiPlayer.marker);
            if(aiMove !== -1) {
                document.querySelector(`.cell[data-index="${aiMove}"]`).textContent = aiPlayer.marker;
            }
        }
    })
})