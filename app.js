// createBoard module
const gameBoard = (() => {
  const cells = 9;
  const board = [];

  for (let i = 0; i < cells; i++) {
    board[i] = null;
  }

  const getBoard = () => board;

  const drawMark = (board, cell, player) => {
    if (board[cell] === null) {
      board[cell] = player;
    }
  };

  return { getBoard, drawMark };
})();

// Players factory function
const Players = () => {
  const player1 = "X";
  const player2 = "O";

  let activePlayer = player1;

  const switchPlayers = () => {
    if (activePlayer === player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  };

  const getPlayer = () => activePlayer;

  return {
    getPlayer,
    switchPlayers,
  };
};

//testing
let board = gameBoard.getBoard();
let player = Players();
gameBoard.drawMark(board, 2, player.getPlayer());
player.switchPlayers();
gameBoard.drawMark(board, 6, player.getPlayer());
console.log(board);

// playGame module
