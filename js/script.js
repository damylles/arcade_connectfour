(function () {
  const myGame = {
    boardEl: null,
    gameRunning: true,
    player: 1,
    boardX: 6,
    boardY: 7,
    board: [],
    players: [
      {
        id: 1,
        name: "Player 1",
      },
      {
        id: 2,
        name: "Computer",
      },
    ],
    /*
     * Executes initialization of the game
     * by defining event listeners and printing initial state of the board.
     */
    init() {
      this.startBoard();
      this.setEvents();
      this.printBoard();
      this.userRegistration();
    },
    restart() {
      this.player = 1;
      this.board.forEach((item) =>
        item.forEach((item2) => (item2.dataset.player = 0))
      );
      this.gameRunning = true;
      this.printBoard();
      this.closePopup();
      this.userRegistration();
    },
    userRegistration() {
      this.showPopup("Connect Four Game", false, function (game) {
        const container = document.createElement("DIV");
        const text = document.createElement("DIV");
        text.innerHTML = "Please register the players name below!";
        container.appendChild(text);

        const player1Wrapper = document.createElement("DIV");
        const player1Label = document.createElement("SPAN");
        player1Label.innerText = "Player 1: ";
        player1Wrapper.appendChild(player1Label);
        const player2Wrapper = document.createElement("DIV");
        const player2Label = document.createElement("SPAN");
        player2Label.innerText = "Player 2: ";
        player2Wrapper.appendChild(player2Label);

        const inputPlayer1 = document.createElement("INPUT");
        player1Wrapper.appendChild(inputPlayer1);
        container.appendChild(player1Wrapper);

        const inputPlayer2 = document.createElement("INPUT");
        inputPlayer2.value = "Computer";
        player2Wrapper.appendChild(inputPlayer2);
        container.appendChild(player2Wrapper);

        const createGame = document.createElement("BUTTON");
        createGame.innerText = "Start Game";
        container.appendChild(createGame);

        createGame.addEventListener("click", function (e) {
          if (inputPlayer1.value)
            game.players.filter((item) => item.id == 1)[0].name =
              inputPlayer1.value;

          game.players.filter((item) => item.id == 2)[0].name =
            inputPlayer2.value;

          const message = document.getElementById("messageH2");
          message.textContent = `${
            game.players.filter((item) => item.id == game.player)[0].name
          }'s turn!`;
          game.closePopup();
        });

        return container;
      });
    },
    showPopup(title, showExit = true, callbackRender) {
      const modal = document.createElement("DIV");
      modal.id = "modal-one";
      modal.classList.add("modal");
      const modalBg = document.createElement("DIV");
      modalBg.classList.add("modal-bg");
      const modalContainer = document.createElement("DIV");
      modalContainer.classList.add("modal-container");
      const eltitle = document.createElement("H1");
      eltitle.innerHTML = title;
      const content = document.createElement("DIV");
      if (typeof callbackRender === "function")
        content.appendChild(callbackRender(this));

      if (showExit) {
        const buttonExit = document.createElement("BUTTON");
        buttonExit.classList.add("modal-close");
        buttonExit.classList.add("modal-exit");
        buttonExit.innerText = "X";
        modalContainer.appendChild(buttonExit);
      }

      modal.appendChild(modalBg);
      modal.appendChild(modalContainer);
      modalContainer.appendChild(eltitle);
      modalContainer.appendChild(content);

      document.body.appendChild(modal);

      modal.classList.add("open");
      const exits = modal.querySelectorAll(".modal-exit");
      game = this;
      exits.forEach(function (exit) {
        exit.addEventListener("click", function (event) {
          event.preventDefault();
          game.closePopup();
        });
      });
    },
    closePopup() {
      const modal = document.querySelector(".modal");
      modal.remove();
    },
    //create the board
    startBoard() {
      const game = myGame;
      this.boardEl = document.getElementById("divWrapper");
      for (let x = 0; x < this.boardX; x++) {
        // if position does not exists create in the array
        if (!this.board[x]) {
          this.board[x] = [];
        }

        // creating board elements
        for (let y = 0; y < this.boardY; y++) {
          //set position on childrens so it's easier to grab values
          const divWrapper = document.createElement("DIV");
          divWrapper.classList.add("dot");
          const circleArea = document.createElement("SPAN");
          this.board[x][y] = circleArea;
          circleArea.classList.add("circle");

          // set position helpsers to help identifying the position of the tiles in the code.
          circleArea.dataset.positionX = x;
          circleArea.dataset.positionY = y;
          circleArea.dataset.player = 0;
          divWrapper.appendChild(circleArea);
          this.boardEl.appendChild(divWrapper);
        }
      }
    },
    setEvents() {
      const self = this;
      this.boardEl.addEventListener("click", function (e) {
        if (
          !self.gameRunning ||
          (self.players[1].name == "Computer" && self.player == 2)
        ) {
          return;
        }
        let target;
        if (e.target.classList.contains("circle")) {
          target = e.target;
        } else {
          target = e.target.firstChild;
        }
        const positionY = Number(target.dataset.positionY);
        self.makePlay(positionY);
      });
    },
    makePlay(positionY) {
      let self = this;
      if (this.dropStone(positionY)) {
        this.printBoard();
        if (this.checkResultWin()) {
          this.showPopup(
            `${
              this.players.filter((item) => item.id == this.player)[0].name
            } won!`,
            false,
            function () {
              const divWrapper = document.createElement("DIV");
              const buttonRestart = document.createElement("BUTTON");
              buttonRestart.innerText = "Restart Game";
              buttonRestart.addEventListener("click", function () {
                self.restart();
              });
              divWrapper.appendChild(buttonRestart);
              return divWrapper;
            }
          );
          this.gameRunning = false;
        } else if (this.checkResultDraw()) {
          this.showPopup(`Draw, Play again!`, false, function () {
            const divWrapper = document.createElement("DIV");
            const buttonRestart = document.createElement("BUTTON");
            buttonRestart.innerText = "Restart Game";
            buttonRestart.addEventListener("click", function () {
              self.restart();
            });
            divWrapper.appendChild(buttonRestart);
            return divWrapper;
          });
          this.gameRunning = false;
        } else {
          this.switchTurn();
        }
      } else {
        this.showPopup("Invalid play! Try again!", false, function () {
          setTimeout(function () {
            self.closePopup();
          }, 1500);
          return document.createElement("SPAN");
        });
      }
    },
    clearPosition(child) {
      child.classList.remove("red");
      child.classList.remove("yellow");
      child.classList.remove("bisque");
    },
    printBoard() {
      for (let x = 0; x < this.board.length; x++) {
        for (let y = 0; y < this.board[x].length; y++) {
          const el = this.board[x][y];
          this.clearPosition(el);
          if (el.dataset.player == 0) {
            el.classList.add("bisque");
          } else if (el.dataset.player == 1) {
            el.classList.add("red");
          } else if (el.dataset.player == 2) {
            el.classList.add("yellow");
          }
        }
      }
    },
    dropStone(positionY) {
      let successful = false;
      for (let x = this.boardX - 1; x >= 0; x--) {
        if (this.board[x][positionY].dataset.player == 0) {
          this.board[x][positionY].dataset.player = this.player;
          return !successful;
        }
      }
      return successful;
    },
    switchTurn() {
      const message = document.getElementById("messageH2");
      if (this.player == 1) {
        this.player = 2;
        if (this.players.filter((item) => item.id == 2)[0].name == "Computer") {
          this.computerPlay();
        }
      } else {
        this.player = 1;
      }
      message.textContent = `${
        this.players.filter((item) => item.id == this.player)[0].name
      }'s turn!`;
    },
    computerPlay() {
      const self = this;
      setTimeout(function () {
        let playablePos = [];
        for (let y = 0; y < self.boardY; y++) {
          if (self.board[0][y].dataset.player == 0) {
            playablePos.push(y);
          }
        }
        let randomPlay = Math.floor(Math.random() * playablePos.length);
        self.makePlay(randomPlay);
      }, 3000);
    },
    checkHorizontal() {
      for (let x = this.boardX - 1; x >= 0; x--) {
        let count = 0;
        for (let y = 0; y < this.boardY; y++) {
          if (this.board[x][y].dataset.player == this.player) {
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
    },
    checkVertical() {
      for (let y = 0; y < this.boardY; y++) {
        let count = 0;
        for (let x = this.boardX - 1; x >= 0; x--) {
          if (this.board[x][y].dataset.player == this.player) {
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
    },
    checkDiagonal() {
      console.log(
        `Diagonal: ${this.checkDiagonalBottomTopStart()} || ${this.checkDiagonalBottomTopEnd()}`
      );
      return (
        this.checkDiagonalBottomTopStart() || this.checkDiagonalBottomTopEnd()
      );
    },
    checkDiagonalBottomTopStart() {
      for (let x = this.boardX - 1; x >= 3; x--) {
        for (let y = 0; y < 4; y++) {
          let test =
            this.board[x][y].dataset.player == this.player &&
            this.board[x - 1][y + 1].dataset.player == this.player &&
            this.board[x - 2][y + 2].dataset.player == this.player &&
            this.board[x - 3][y + 3].dataset.player == this.player;

          if (test) {
            return true;
          }
        }
      }
      return false;
    },
    checkDiagonalBottomTopEnd() {
      for (let x = this.boardX - 1; x >= 3; x--) {
        for (let y = this.boardY - 1; y >= 3; y--) {
          const test =
            this.board[x][y].dataset.player == this.player &&
            this.board[x - 1][y - 1].dataset.player == this.player &&
            this.board[x - 2][y - 2].dataset.player == this.player &&
            this.board[x - 3][y - 3].dataset.player == this.player;

          if (test) {
            return true;
          }
        }
      }
      return false;
    },
    checkResultWin() {
      console.log(
        `Regular: ${this.checkHorizontal()} || ${this.checkVertical()} || ${this.checkDiagonal()}`
      );
      return (
        this.checkHorizontal() || this.checkVertical() || this.checkDiagonal()
      );
    },
    checkResultDraw() {
      for (let x = 0; x < this.boardX; x++) {
        for (let y = 0; y < this.boardY; y++) {
          if (this.board[x][y].dataset.player == 0) {
            return false;
          }
        }
      }
      return true;
    },
  };
  // initialize game
  window.onload = function () {
    myGame.init();
  };
})();
