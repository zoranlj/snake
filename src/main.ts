// main.ts - Snake Game using TypeScript

// Get canvas and its context, and adjust its dimensions to fill the window
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const speedControl = 100;

// Use a grid for the game; each snake cell will be this many pixels square
const cellSize = 20;
let gridWidth = 0;
let gridHeight = 0;

function resizeCanvas(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gridWidth = Math.floor(canvas.width / cellSize);
  gridHeight = Math.floor(canvas.height / cellSize);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Data types for positions
interface Point {
  x: number;
  y: number;
}

// Snake game state
let snake: Point[] = [];
let direction: Point = { x: 1, y: 0 }; // moving right initially
let food: Point = { x: 0, y: 0 };
let snakeSpeed: number = Number(speedControl); // speed in ms between moves
let gameIntervalId: number | null = null;

// Initialize game: reset snake, direction and food
function initGame(): void {
  snake = [
    { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }
  ];
  direction = { x: 1, y: 0 };
  placeFood();
  // Clear any existing interval then start new game loop
  if (gameIntervalId !== null) {
    clearInterval(gameIntervalId);
  }
  gameIntervalId = window.setInterval(gameLoop, snakeSpeed);
}

// Place food at a random position (make sure it's not on the snake)
function placeFood(): void {
  let valid = false;
  while (!valid) {
    const newFood = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };
    // Check collision with snake
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      food = newFood;
      valid = true;
    }
  }
}

// Game loop: update snake position, check collisions, and redraw
function gameLoop(): void {
  // Calculate new head position
  const head = snake[0];
  const newHead: Point = { x: head.x + direction.x, y: head.y + direction.y };

  // Check for wall collision
  if (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= gridWidth ||
      newHead.y >= gridHeight
  ) {
    gameOver();
    return;
  }

  // Self collision check
  if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    gameOver();
    return;
  }

  // Add new head to snake
  snake.unshift(newHead);

  // Check food collision: if snake eats food, don't remove the tail to grow
  if (newHead.x === food.x && newHead.y === food.y) {
    placeFood();
  } else {
    // Remove tail segment
    snake.pop();
  }

  draw();
}

// Draw the game elements on the canvas
function draw(): void {
  // Clear the canvas
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

  // Draw snake
  ctx.fillStyle = "lime";
  for (const segment of snake) {
    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  }
}

// Handle game over: for now, simply alert and restart the game
function gameOver(): void {
  if (gameIntervalId !== null) {
    clearInterval(gameIntervalId);
  }
  alert("Game Over! Press OK to restart.");
  initGame();
}

// Handle keyboard input for snake direction
window.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Start the game
initGame();