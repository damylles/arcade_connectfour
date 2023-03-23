let board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

let player = 1;
let stopGame = false;

function convertToNumber(x, y) {
  return y + 7 * (x + 1 - 1);
}

function convertToPair(value) {
  let count = 0;
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (count == value) return [x, y];
      count++;
    }
  }
}

function clearPosition(child) {
  child.classList.remove("red");
  child.classList.remove("yellow");
  child.classList.remove("bisque");
}

function printBoard() {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      let count = convertToNumber(x, y);
      clearPosition(getChildren()[count]);
      if (board[x][y] == 0) {
        getChildren()[count].classList.add("bisque");
      } else if (board[x][y] == 1) {
        getChildren()[count].classList.add("red");
      } else if (board[x][y] == 2) {
        getChildren()[count].classList.add("yellow");
      }
      getChildren()[convertToNumber(x, y)].dataset.hasStone = true;
    }
  }
}

function dropStone(positionY, player) {
  for (let x = 5; x >= 0; x--) {
    if (board[x][positionY] == 0) {
      board[x][positionY] = player;
      return;
    }
  }
}

function getChildren() {
  return document.getElementsByClassName("circle");
}

function switchTurn() {
  let message = document.getElementById("messageH2");
  if (player == 1) {
    player = 2;
  } else {
    player = 1;
  }
  message.textContent = `Player ${[player]} turn!`;
}

function checkHorizontal(player) {
  let count = 0;
  for (let x = 5; x >= 0; x--) {
    for (let y = 0; y < 7; y++) {
      if (board[x][y] == player) {
        count++;
        if (count == 4) {
          return true;
        }
      } else {
        count = 0;
      }
    }
  }
  return false;
}

function checkVertial(player) {
  let count = 0;
  for (let y = 0; y < 7; y++) {
    for (let x = 5; x >= 0; x--) {
      if (board[x][y] == player) {
        count++;
        if (count == 4) {
          return true;
        }
      } else {
        count = 0;
      }
    }
  }
  return false;
}

function checkDiagonal(player) {
  return (
    checkDiagonalBottomTopStart(player) || checkDiagonalBottomTopEnd(player)
  );
}

function checkDiagonalBottomTopStart(player) {
  for (let x = 5; x >= 3; x--) {
    for (let y = 0; y < 4; y++) {
      let test =
        board[x][y] == player &&
        board[x - 1][y + 1] == player &&
        board[x - 2][y + 2] == player &&
        board[x - 3][y + 3] == player;

      if (test) {
        return true;
      }
    }
  }
  return false;
}

function checkDiagonalBottomTopEnd(player) {
  for (let x = 5; x >= 3; x--) {
    for (let y = 6; y >= 3; y--) {
      let test =
        board[x][y] == player &&
        board[x - 1][y - 1] == player &&
        board[x - 2][y - 2] == player &&
        board[x - 3][y - 3] == player;

      if (test) {
        return true;
      }
    }
  }
  return false;
}

function checkResult(player) {
  return (
    checkHorizontal(player) || checkVertial(player) || checkDiagonal(player)
  );
}

function setEvent() {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      let count = convertToNumber(x, y);

      //set position on childrens so it's easier to grab values
      getChildren()[count].dataset.positionX = convertToPair(count)[0];
      getChildren()[count].dataset.positionY = convertToPair(count)[1];

      //my event listener here is where the game happens
      getChildren()[count].addEventListener("click", function (e) {
        if (stopGame) {
          return;
        }
        let positionY = Number(e.target.dataset.positionY);
        dropStone(positionY, player);
        printBoard();
        if (checkResult(player)) {
          let message = document.getElementById("messageH2");
          message.innerHTML = `Player ${[
            player,
          ]} WON! <div><button id="restart" onclick="window.location.reload();">Restart</button><div>`;
          stopGame = true;
        } else {
          switchTurn();
        }
      });
    }
  }
}

window.onload = function () {
  let message = document.getElementById("messageH2");
  message.textContent = `Player ${[player]} turn!`;
  setEvent();
  printBoard();
};
