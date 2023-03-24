const container = document.querySelector(".container");

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

container.addEventListener("click", (e) => {
  console.log(e);
  gameBoard.drawMark(board, e.target.className, player.getPlayer());
  player.switchPlayers();
});
// gameBoard.drawMark(board, 0, player.getPlayer());
// player.switchPlayers();
// gameBoard.drawMark(board, 6, player.getPlayer());null

// board = ["X", "X", "X", "X", "X", "X", "X", "X", "O"];
// console.log(board);

// playGame module
const Game = (() => {
  let winner;
  let result = false;

  const gameEnd = (board) => {
    let counter = 0;
    for (item of board) {
      if (item === null) counter++;
    }

    if (counter === 0) {
      result = "DRAW";
    } else if (
      board[0] === board[1] &&
      board[1] === board[2] &&
      board[0] !== null
    ) {
      result = true;
    } else if (
      board[3] === board[4] &&
      board[4] === board[5] &&
      board[3] !== null
    ) {
      result = true;
    } else if (
      board[6] === board[7] &&
      board[7] === board[8] &&
      board[6] !== null
    ) {
      result = true;
    } else if (
      board[0] === board[3] &&
      board[3] === board[6] &&
      board[0] !== null
    ) {
      result = true;
    } else if (
      board[1] === board[4] &&
      board[4] === board[7] &&
      board[1] !== null
    ) {
      result = true;
    } else if (
      board[2] === board[5] &&
      board[5] === board[8] &&
      board[2] !== null
    ) {
      result = true;
    } else if (
      board[0] === board[4] &&
      board[4] === board[8] &&
      board[0] !== null
    ) {
      result = true;
    } else if (
      board[2] === board[4] &&
      board[4] === board[6] &&
      board[2] !== null
    ) {
      result = true;
    }

    return result;
  };

  return { gameEnd };
})();

if (Game.gameEnd(board) === "DRAW") {
  console.log("DRAW");
} else if (Game.gameEnd(board) === true) {
  console.log("WIN");
}

//if endgame not by draw -> switchPlayer -> currentPlayer = winner
