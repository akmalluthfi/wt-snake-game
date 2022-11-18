// element
const boardEl = document.getElementById("board");
const ctx = boardEl.getContext("2d");
const score = document.getElementById("score");
const level = document.getElementById("level");
const indicatorGame = document.getElementById("indicator-game");

// object snake
const snake = {
	trails: [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
	],
	position: {
		x: 2,
		y: 0,
	},
	tail: 3,
};

// object game
const game = {
	level: 1,
	started: false,
	stateKey: "ArrowRight",
	objectSize: 20,
	operation: {
		x: 1,
		y: 0,
	},
	score: 0,
	time: 5,
};

// object board
const board = {
	width: boardEl.width / game.objectSize,
	height: boardEl.height / game.objectSize,
};

// object food
const food = {
	posX: Math.floor(Math.random() * board.width),
	posY: Math.floor(Math.random() * board.height),
};

document.addEventListener("DOMContentLoaded", () => {
	renderBoard();
	renderSnake();
	renderFood();
	renderScore();

	// handle when keyboard onkeydown
	let timer = null;
	document.addEventListener("keydown", (e) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			handleKeydown(e);
		}, 1000 / (5 * 1.8));
	});

	start();
});

const start = () => {
	if (game.started) run();
	setTimeout(start, 1000 / game.time);
};

const run = () => {
	// Move the snake
	snake.position.x += game.operation.x;
	snake.position.y += game.operation.y;

	// handle snake when hit the line
	if (
		snake.position.x >= game.objectSize ||
		snake.position.x < 0 ||
		snake.position.y >= game.objectSize ||
		snake.position.y < 0
	) {
		renderGameOverLabel();
		reset();
		return;
	}

	renderBoard();
	renderSnake();
	console.log(snake.trails);
	// console.log(snake.position, game.operation);
	return;

	// handle snake head meet snake body
	snake.trails.forEach((trail) => {
		console.log(trail, snake.position);
		if (trail.x === snake.position.x && trail.y === snake.position.y) {
			renderGameOverLabel();
			reset();
		}
	});

	snake.trails.push({ x: snake.position.x, y: snake.position.y });

	if (snake.trails.length > snake.tail) {
		snake.trails.shift();
	}

	// run snake
	// runSnake();

	// handle snake when hit body
};

const reset = () => {
	game.started = false;

	// reset the snake
	snake.trails = [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
	];
	snake.position = {
		x: 2,
		y: 0,
	};
	snake.tail = 3;

	// reset the game
	game.level = 1;
	game.started = false;
	game.stateKey = "ArrowRight";
	game.operation = {
		x: 1,
		y: 0,
	};
	game.score = 0;
	game.time = 5;

	// reset food position
	food.posX = Math.floor(Math.random() * board.width);
	food.posY = Math.floor(Math.random() * board.height);
};

const runSnake = () => {
	renderBoard();
	renderFood();
	renderSnake();

	snake.trails.push({ x: snake.position.x, y: snake.position.y });

	if (snake.trails.length > snake.tail) {
		snake.trails.shift();
	}
};

const handleKeydown = (event) => {
	if (event.key === "ArrowUp" && game.stateKey !== "ArrowDown") {
		game.stateKey = event.key;
		game.operation.x = 0;
		game.operation.y = -1;
	} else if (event.key === "ArrowRight" && game.stateKey !== "ArrowLeft") {
		game.stateKey = event.key;
		game.operation.x = 1;
		game.operation.y = 0;
	} else if (event.key === "ArrowDown" && game.stateKey !== "ArrowUp") {
		game.stateKey = event.key;
		game.operation.x = 0;
		game.operation.y = 1;
	} else if (event.key === "ArrowLeft" && game.stateKey !== "ArrowRight") {
		game.stateKey = event.key;
		game.operation.x = -1;
		game.operation.y = 0;
	}

	if (!game.started) {
		if (event.key === "Enter") {
			renderStartLabel();
			game.started = true;
		}
	}
};

const renderGameOverLabel = () => {
	indicatorGame.classList.remove("text-success");
	indicatorGame.classList.add("text-danger");
	indicatorGame.innerText = "game over";
};

const renderStartLabel = () => {
	indicatorGame.classList.remove("text-danger");
	indicatorGame.classList.add("text-success");
	indicatorGame.innerText = "started";
};

const renderLevel = () => {
	level.innerHTML = game.level;
};

const renderScore = () => {
	score.innerHTML = game.score;
};

const renderFood = () => {
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.roundRect(
		food.posX * game.objectSize,
		food.posX * game.objectSize,
		game.objectSize - 1,
		game.objectSize - 1,
		10
	);
	ctx.fill();
};

const renderBoard = () => {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, boardEl.width, boardEl.height);
};

const renderSnake = () => {
	ctx.fillStyle = "lime";
	ctx.beginPath();
	snake.trails.forEach((trail) => {
		ctx.roundRect(
			trail.x * game.objectSize,
			trail.y * game.objectSize,
			game.objectSize - 1,
			game.objectSize - 1,
			3
		);
		ctx.fill();
	});
};
