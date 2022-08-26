document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];

  // The Tetrominoes

  // Tetromino Index [0]

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2], // Rotation Index [0]
    [width, width + 1, width + 2, width * 2 + 2], // Rotation Index [1]
    [1, width + 1, width * 2 + 1, width * 2], // Rotation Index [2]
    [width, width * 2, width * 2 + 1, width * 2 + 2], // Rotation Index[3]
  ];

  // Tetromino Index [1]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  // Tetromino Index [2]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  // Tetromino Index [3]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  // Tetromino Index [4]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  // Put ALL Tetrominoes in an array

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  // The tetrominoes will start on square of index 4 within the grid

  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a Tetromino and its first rotation

  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][0];

  // Draw the Tetromino

  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // Undraw the Tetromino

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  // Make the Tetromino move down every second

  //   timerId = setInterval(moveDown, 250); // 1000 ms = 1 second

  // Assign funciton to keyCodes

  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  // document.addEventListener('event', function)

  document.addEventListener("keyup", control);

  // Move down function

  function moveDown() {
    undraw(); // invoke the undraw funtion
    currentPosition += width; // add whole width to the
    draw(); // invoke the draw function
    freeze(); // invoke the freeze function
  }

  // Freeze function (when shape gets to the bottom it needs to stop)

  // "If SOME of the squares that make up the current Tetromino, their index + width contains the class of "taken" then we turn each of the Tetromino squares into a square that contains the class of "taken"
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      // Start a new falling Tetromino
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // Move the tetromino left, unless its at the edge or there is a blockage

  // If currentPosition of the tetromino divided by the width = 0

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    // If shape is NOT at the left edge

    if (!isAtLeftEdge) currentPosition -= 1;

    // If there is another tetromino in the way

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    )
      currentPostion += 1;
  }

  draw();

  // Move Tetromino to the right, unless there is an edge or blockage

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  // Rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      // if current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];

    draw();
  }

  // show up-next tetromino in the mini-grid display

  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  // The Tetrominos without rotations

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayIndex * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  // Display the shape in the mini-grid display

  function displayShape() {
    displaySquares.forEach((square) => {
      // Remove any trace of tetromino from the entire grid
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  // Add functionality to the start/pause button

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 250);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  // Add Score & Remove fully "taken" row

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // Game Over

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "Game Over";
      clearInterval(timerId);
    }
  }
});
