/**
 * Bugs
 * > Makanan tidak boleh dirender di tubuh ular
 * > Jika kita dengan cepat menekan atas dan kiri, poda saat ular berjalan ke kanan, kepala ular akan berputar 360deg
 *
 * */

// html elements
const board = document.getElementById("board");
const ctx = board.getContext("2d");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const indicatorGame = document.getElementById("indicator-game");

// variables state
// state to save keydown, for first move it will be right
let stateKey = "ArrowRight";
// size 1 box snake
let objectSize = 20;
// max size for board
let maxBoardWidth = board.width / objectSize;
let maxBoardHeight = board.height / objectSize;
// position snake
let posSnakeX = 2;
let posSnakeY = 0;
// operation to decide position snake
let operationX = 1;
let operationY = 0;
// trails that has been passed by snake
// set first position for snake
let trails = [
	{ x: 0, y: 0 },
	{ x: 1, y: 0 },
	{ x: posSnakeX, y: posSnakeY }, // head of snake
];
// length of snake
let tail = 3;
let tailState = 10;
// level
let level = 1;
// to indicate game start or not
let started = false;
// position food
let posFoodX = Math.floor(Math.random() * maxBoardWidth);
let posFoodY = Math.floor(Math.random() * maxBoardHeight);

// Time
let time = 5;

const Game = {
	start() {
		this.renderBoard();
		this.renderSnake();
		this.renderFood();
		this.renderScore();
		this.renderLevel();

		// debounce
		let timer = null;
		document.addEventListener("keydown", (e) => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				this.handleKeydown(e);
			}, 1000 / (5 * 1.8));
		});
		// document.addEventListener("keydown", this.handleKeydown);

		setTimeout(() => {
			if (started) this.run();
			this.start();
		}, 1000 / time);
	},

	renderBoard() {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, board.width, board.height);
	},

	handleKeydown(event) {
		if (event.key === "ArrowUp" && stateKey !== "ArrowDown") {
			stateKey = event.key;
			operationX = 0;
			operationY = -1;
		} else if (event.key === "ArrowRight" && stateKey !== "ArrowLeft") {
			stateKey = event.key;
			operationX = 1;
			operationY = 0;
		} else if (event.key === "ArrowDown" && stateKey !== "ArrowUp") {
			stateKey = event.key;
			operationX = 0;
			operationY = 1;
		} else if (event.key === "ArrowLeft" && stateKey !== "ArrowRight") {
			stateKey = event.key;
			operationX = -1;
			operationY = 0;
		}

		if (!started) {
			if (event.key === "Enter") {
				indicatorGame.classList.remove("text-danger", "text-success");
				indicatorGame.classList.add("text-success");
				indicatorGame.innerText = "started";
				Game.reset();
				started = true;
				this.run();
			}
		}
	},

	run() {
		// Object Move
		posSnakeX += operationX;
		posSnakeY += operationY;

		// handle snake when hit the line
		if (posSnakeX > maxBoardWidth - 1 || posSnakeX < 0) {
			this.setToGameOver();
			return;
		}

		if (posSnakeY > maxBoardHeight - 1 || posSnakeY < 0) {
			this.setToGameOver();
			return;
		}

		// render level & score
		this.renderLevel();
		this.renderScore();

		// handle snake head meet snake body
		trails.forEach((trail) => {
			if (trail.x === posSnakeX && trail.y === posSnakeY) {
				this.setToGameOver();
			}
		});

		// Render Snake
		this.runSnake();

		// handle Food
		if (posSnakeX == posFoodX && posSnakeY == posFoodY) {
			tail++;
			// change position food
			posFoodX = Math.floor(Math.random() * maxBoardWidth);
			posFoodY = Math.floor(Math.random() * maxBoardHeight);

			// level up
			if (tailState === tail) {
				tailState += 10;
				level++;
				time += 5;
				console.log(time);
				this.renderLevel();
			}

			this.renderFood();
			this.renderScore();
		}
	},

	renderSnake() {
		ctx.fillStyle = "lime";
		ctx.beginPath();
		trails.forEach((trail) => {
			ctx.roundRect(
				trail.x * objectSize,
				trail.y * objectSize,
				objectSize - 1,
				objectSize - 1,
				3
			);
			ctx.fill();
		});
	},

	runSnake() {
		trails.push({ x: posSnakeX, y: posSnakeY });

		if (trails.length > tail) {
			trails.shift();
		}

		this.renderBoard();
		this.renderSnake();
		this.renderFood();
	},

	reset() {
		stateKey = "ArrowRight";
		posSnakeX = 1;
		posSnakeY = 0;
		operationX = 1;
		operationY = 0;
		trails = [
			{ x: -1, y: 0 },
			{ x: 0, y: 0 },
			{ x: posSnakeX, y: posSnakeY },
		];
		tail = 3;
		tailState = 10;
		level = 1;
		time = 5;
	},

	renderFood() {
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.roundRect(
			posFoodX * objectSize,
			posFoodY * objectSize,
			objectSize - 1,
			objectSize - 1,
			10
		);
		ctx.fill();
	},

	renderScore() {
		scoreEl.innerHTML = tail;
	},

	renderLevel() {
		levelEl.innerHTML = level;
	},

	setToGameOver() {
		started = false;
		indicatorGame.classList.remove("text-success");
		indicatorGame.classList.add("text-danger");
		indicatorGame.innerText = "game over";
	},
};

window.addEventListener("load", function () {
	Game.start();
});
