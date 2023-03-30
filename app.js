const container = document.querySelector(".container");
const cells = container.querySelectorAll("div");
const startBtn = document.querySelector(".startBtn");
const menu = document.querySelector(".options");
const modal = document.querySelector("#modal");
const retryBtn = document.querySelector(".retryBtn");
const exitBtn = document.querySelector(".exitBtn");
const boardHide = document.querySelector("#hide");
const whoseTurn = document.querySelector("#turn");

container.addEventListener("click", handleClick);
startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", restartGame);
exitBtn.addEventListener("click", exitGame);

let vsComputer = false;

function handleClick(e) {
  displayController.addMark(e);
  displayController.drawInDOM();
  displayController.displayTurn();

  if (Game.gameEnd(gameBoard.getBoard())) {
    Game.getWinner();
    return;
  }

  if (vsComputer) {
    ComputerMove.randomMove();
  }
}

function startGame() {
  let player1 = document.querySelector(
    'input[name="player1-type"]:checked'
  ).value;
  let player2 = document.querySelector(
    'input[name="player2-type"]:checked'
  ).value;
  Player.getNick();
  menu.classList.add("hide");
  boardHide.classList.remove("hide");
  whoseTurn.textContent = `${Player.whichPlayer()}'s turn!`;
  vsComputer = Player.differentPlayerSetup(player1, player2);
}

function restartGame() {
  let player1 = document.querySelector(
    'input[name="player1-type"]:checked'
  ).value;
  let player2 = document.querySelector(
    'input[name="player2-type"]:checked'
  ).value;
  gameBoard.clearBoard();
  vsComputer = Player.differentPlayerSetup(player1, player2);
  Player.startingPlayer();
  Game.reset();
  displayController.drawInDOM();
  displayController.displayTurn();
  modal.setAttribute("style", "display: none;");
  modal.close();
}

function exitGame() {
  gameBoard.clearBoard();
  Player.startingPlayer();
  Game.reset();
  displayController.drawInDOM();
  displayController.displayTurn();
  modal.setAttribute("style", "display: none;");
  modal.close();
  menu.classList.remove("hide");
  boardHide.classList.add("hide");
}

// Create Board module
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

  const clearBoard = () => {
    for (let i = 0; i < cells; i++) {
      board[i] = null;
    }
  };

  return { getBoard, drawMark, clearBoard };
})();

// Players module
const Player = (() => {
  const player1 = "X";
  const player2 = "O";

  const getNick = () => {
    let nick1 = document.querySelector("#player1-name").value;
    let nick2 = document.querySelector("#player2-name").value;
    return [nick1, nick2];
  };

  let activePlayer = player1;

  const switchPlayers = () => {
    if (activePlayer === player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  };

  const getPlayer = () => activePlayer;

  const startingPlayer = () => {
    activePlayer = player1;
  };

  const whichPlayer = () => {
    let currentPlayer;
    if (activePlayer === player1) {
      currentPlayer = getNick()[0];
    } else currentPlayer = getNick()[1];
    return currentPlayer;
  };

  const differentPlayerSetup = (choice1, choice2) => {
    if (choice1 === "computer" && choice2 === "human") {
      ComputerMove.randomMove();
      return true;
    } else if (choice1 === "computer" && choice2 === "computer") {
      const recursiveMove = () => {
        if (!Game.gameEnd(gameBoard.getBoard())) {
          ComputerMove.randomMove();
          setTimeout(recursiveMove, 1000);
        }
      };
      setTimeout(recursiveMove, 1000);
      return true;
    } else if (choice1 === "human" && choice2 === "computer") {
      return true;
    }
    return false;
  };

  return {
    getPlayer,
    switchPlayers,
    startingPlayer,
    whichPlayer,
    differentPlayerSetup,
    getNick,
  };
})();

// Display module
const displayController = (() => {
  const board = gameBoard.getBoard();

  const addMark = (e) => {
    if (e.target.textContent === "") {
      gameBoard.drawMark(board, e.target.className, Player.getPlayer());
      Player.switchPlayers();
    } else return;
  };

  const drawInDOM = () => {
    for (let i = 0; i < 9; i++) {
      cells[i].textContent = board[i];
    }
  };

  const displayTurn = () => {
    whoseTurn.textContent = `${Player.whichPlayer()}'s turn!`;
  };

  return { addMark, drawInDOM, displayTurn };
})();

// Game logic module
const Game = (() => {
  let result = false;
  const resultDiv = document.createElement("div");

  const gameEnd = (board) => {
    let counter = 0;

    for (const item of board) {
      if (item === null) counter++;
    }

    if (board[0] === board[1] && board[1] === board[2] && board[0] !== null) {
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
    } else if (counter === 0) {
      result = "DRAW";
    }

    if (result) {
      whoseTurn.textContent = "";
    }

    return result;
  };

  const getWinner = () => {
    const result = gameEnd(gameBoard.getBoard());
    if (result === "DRAW") {
      resultDiv.textContent = "DRAW!";
      modal.insertBefore(resultDiv, exitBtn);
      modal.setAttribute("style", "display: flex;");
      modal.showModal();
      console.log("DRAW");
    } else if (result === true) {
      Player.switchPlayers();
      if (Player.getPlayer() === "X") {
        resultDiv.textContent = `Player ${Player.getNick()[0]} WON!`;
      } else resultDiv.textContent = `Player ${Player.getNick()[1]} WON!`;
      modal.insertBefore(resultDiv, exitBtn);
      modal.setAttribute("style", "display: flex;");
      modal.showModal();
      console.log(`Player ${Player.getPlayer()} WON!`);
    }
  };

  const reset = () => {
    result = false;
  };

  return { gameEnd, getWinner, reset };
})();

//AI module

const ComputerMove = (() => {
  const board = gameBoard.getBoard();

  const availableCells = () => {
    const nullIndexes = board
      .map((elem, index) => {
        if (elem === null) {
          return index;
        }
      })
      .filter((index) => index !== undefined);
    return nullIndexes;
  };

  const randomMove = () => {
    let board = availableCells();
    randomCell = Math.floor(Math.random() * board.length);

    setTimeout(() => {
      gameBoard.drawMark(
        gameBoard.getBoard(),
        board[randomCell],
        Player.getPlayer()
      );
      Player.switchPlayers();
      displayController.displayTurn();
      displayController.drawInDOM();
      if (Game.gameEnd(gameBoard.getBoard())) {
        Game.getWinner();
      }
    }, "1000");
  };

  return { randomMove };
})();
