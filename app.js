const container = document.querySelector(".container");
const cells = container.querySelectorAll("div");
const startBtn = document.querySelector(".startBtn");
const menu = document.querySelector(".options");
const modal = document.querySelector("#modal");
const retryBtn = document.querySelector(".retryBtn");
const exitBtn = document.querySelector(".exitBtn");
const boardHide = document.querySelector("#hide");
const whoseTurn = document.querySelector("#turn");
const modeDiv1 = document.querySelector(".mode-div1");
const modeDiv2 = document.querySelector(".mode-div2");

container.addEventListener("click", handleClick);
startBtn.addEventListener("click", startGame);
retryBtn.addEventListener("click", restartGame);
exitBtn.addEventListener("click", exitGame);

const playerTypeRadios = document.querySelectorAll('input[name$="-type"]');
playerTypeRadios.forEach((radio) =>
  radio.addEventListener("change", displayModeSelect)
);

function displayModeSelect() {
  const player1Type = document.querySelector(
    'input[name="player1-type"]:checked'
  ).value;
  const player2Type = document.querySelector(
    'input[name="player2-type"]:checked'
  ).value;

  if (player1Type === "computer") {
    modeDiv1.style.display = "block";
  } else {
    modeDiv1.style.display = "none";
  }

  if (player2Type === "computer") {
    modeDiv2.style.display = "block";
  } else {
    modeDiv2.style.display = "none";
  }
}

let vsComputer = false;

function handleClick(e) {
  if (e.target.classList.contains("occupied")) {
    return;
  }
  displayController.addMark(e);
  displayController.drawInDOM();
  displayController.displayTurn();
  if (vsComputer) container.removeEventListener("click", handleClick);

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
  container.addEventListener("click", handleClick);
  vsComputer = Player.differentPlayerSetup(player1, player2);
  cells.forEach((element) => element.classList.remove("occupied"));
  Player.startingPlayer();
  Game.reset();
  displayController.drawInDOM();
  displayController.displayTurn();
  modal.setAttribute("style", "display: none;");
  modal.close();
}

function exitGame() {
  gameBoard.clearBoard();
  cells.forEach((element) => element.classList.remove("occupied"));
  container.addEventListener("click", handleClick);
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
      container.removeEventListener("click", handleClick);
      ComputerMove.randomMove();
      return true;
    } else if (choice1 === "computer" && choice2 === "computer") {
      const recursiveMove = () => {
        if (!Game.gameEnd(gameBoard.getBoard())) {
          container.removeEventListener("click", handleClick);
          ComputerMove.randomMove();
          setTimeout(recursiveMove, 1000);
        }
      };
      setTimeout(recursiveMove, 1000);
      return true;
    } else if (choice1 === "human" && choice2 === "computer") {
      container.addEventListener("click", handleClick);
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
      if (board[i] !== null) cells[i].classList.add("occupied");
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
    const emptyCells = board.filter((cell) => cell === null).length;

    const winningSetup = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const isWinning = winningSetup.some(
      ([a, b, c]) => board[a] && board[a] === board[b] && board[b] === board[c]
    );

    const result = isWinning ? true : emptyCells === 0 ? "DRAW" : false;

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
      container.addEventListener("click", handleClick);
    }, "1000");
  };

  return { randomMove };
})();
