const tiles = [...Array(16).keys()].map((n) => {
  return document.getElementById(n);
});
score = document.getElementById("score");
bestScore = document.getElementById("best-score");
gameOver = document.getElementById("game-over");
board = document.getElementById("board");
restartButton = document.getElementById("restart-btn");

const Game = {
  board: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  color: {
    2: "#d026ff",
    4: "#7B1FA2",
    8: "#fb8f37",
    16: "#E65100",
    32: "#C62828",
    64: "#AD1457",
    128: "#6A1B9A",
    256: "#4527A0",
    512: "#1565C0",
    1024: "#00695C",
    2048: "#2E7D32",
  },
  score: 0,
  bestScore: 0,
  playable: true,
};

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function isplayable() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (Game.board[i][j] === 2048) return false;

      if (Game.board[i][j] === 0) return true;

      if (j < 3) {
        if (Game.board[i][j] === Game.board[i][j + 1]) return true;
      }

      if (i < 3) {
        if (Game.board[i][j] === Game.board[i + 1][j]) return true;
      }
    }
  }

  return false;
}

function randTile() {
  let unoccupiedTiles = [];

  for (let i = 0; i < 16; i++) {
    if (Game.board[Math.floor(i / 4)][i % 4] == 0) unoccupiedTiles.push(i);
    if (Game.board[Math.floor(i / 4)][i % 4] == 2048) {
      gameOver.children[0].innerText = "You Won 🎉";
      gameOver.style["z-index"] = "1";
      Game.playable = false;
      Game.bestScore =
        Game.score > Game.bestScore ? Game.score : Game.bestScore;

      bestScore.innerText = `${Game.bestScore}`;
      return;
    }
  }

  if (unoccupiedTiles.length > 0) {
    let i = unoccupiedTiles[randInt(0, unoccupiedTiles.length - 1)];
    Game.board[Math.floor(i / 4)][i % 4] = 2;
  }

  if (!isplayable()) {
    gameOver.style["z-index"] = "1";

    if (Game.score > Game.bestScore) {
      Game.bestScore = Game.score;
      bestScore.innerText = `\n${Game.bestScore}`;
    }
  }
}

function initiateGame() {
  Game.score = 0;
  Game.playable = true;
  gameOver.style["z-index"] = "-1";
  gameOver.children[0].innerText = "Game Over!";

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) Game.board[i][j] = 0;
  }

  randTile();
  randTile();
  renderBoard();
}

function renderBoard() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = tiles[4 * i + j];
      const value = Game.board[i][j];

      if (value) {
        tile.children[0].innerText = value;
        tile.classList.add("has-value");
        tile.style.backgroundColor = Game.color[value];

        const digitCount = value.toString().length;

        if (digitCount === 1)
          tile.children[0].style.fontSize = "clamp(1.5rem, 5vw, 3rem)";
        else if (digitCount === 2)
          tile.children[0].style.fontSize = "clamp(1.3rem, 4.5vw, 2.5rem)";
        else if (digitCount === 3)
          tile.children[0].style.fontSize = "clamp(1rem, 4vw, 2rem)";
        else tile.children[0].style.fontSize = "clamp(0.8rem, 3.5vw, 1.5rem)";
      } else {
        tile.children[0].innerText = "";
        tile.classList.remove("has-value");
        tile.style.backgroundColor = "";
      }
    }
  }

  score.innerText = `\n${Game.score}`;
}

function moveLeft() {
  if (!Game.playable) return;

  for (let i = 0; i < 4; i++) {
    let row = [...Game.board[i]];
    row = row.filter((val) => val !== 0);

    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2;
        row[j + 1] = 0;

        Game.score += row[j];
      }
    }

    row = row.filter((val) => val !== 0);

    while (row.length < 4) {
      row.push(0);
    }

    Game.board[i] = row;
  }
  randTile();
  renderBoard();
}

function moveRight() {
  if (!Game.playable) return;

  for (let i = 0; i < 4; i++) {
    let row = Game.board[i];
    row = row.filter((val) => val !== 0);

    for (let j = row.length - 1; j > 0; j--) {
      if (row[j] === row[j - 1]) {
        row[j] = 2 * row[j - 1];
        row[j - 1] = 0;

        Game.score += row[j];
      }
    }

    row = row.filter((val) => val !== 0);

    while (row.length < 4) {
      row = [0, ...row];
    }

    Game.board[i] = row;
  }
  randTile();
  renderBoard();
}

function moveUp() {
  if (!Game.playable) return;

  for (let j = 0; j < 4; j++) {
    let column = [...Array(4).keys()].map((idx) => Game.board[idx][j]);
    column = column.filter((val) => val !== 0);

    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        column[i + 1] = 0;

        Game.score += column[i];
      }
    }

    column = column.filter((val) => val !== 0);

    let k = 0;
    while (k < column.length) {
      Game.board[k][j] = column[k];
      k++;
    }

    while (k < 4) {
      Game.board[k][j] = 0;
      k++;
    }
  }
  randTile();
  renderBoard();
}

function moveDown() {
  if (!Game.playable) return;

  for (let j = 0; j < 4; j++) {
    let column = [...Array(4).keys()].map((idx) => Game.board[idx][j]);
    column = column.filter((val) => val !== 0);

    for (let i = column.length - 1; i >= 0; i--) {
      if (column[i] == column[i - 1]) {
        column[i] *= 2;
        column[i - 1] = 0;

        Game.score += column[i];
      }
    }

    column = column.filter((val) => val !== 0);

    let k = column.length - 1,
      i = 3;

    while (i >= 0 && k >= 0) {
      Game.board[i][j] = column[k];
      i--;
      k--;
    }

    while (i >= 0) {
      Game.board[i][j] = 0;
      i--;
    }
  }
  randTile();
  renderBoard();
}

function handleEvent(e) {
  switch (e.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
  }
}

let startX = 0;
let startY = 0;

function handleTouch(event) {
  
  const xdiff = startX - event.changedTouches[0].clientX;
  const ydiff = startY - event.changedTouches[0].clientY;

  console.log(startX, ',', event.changedTouches[0].clientX);

  if(Math.abs(xdiff)<=40 && Math.abs(ydiff)<=40)
    return;

  if (Math.abs(xdiff) > Math.abs(ydiff)) {
    if (xdiff > 0) moveLeft();
    else moveRight();
  } else {
    if (ydiff > 0) moveUp();
    else moveDown();
  }
}
bestScore.innerText = "\n0";
initiateGame();

restartButton.addEventListener("click", initiateGame);
window.addEventListener("keydown", handleEvent);

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener("touchend", handleTouch);