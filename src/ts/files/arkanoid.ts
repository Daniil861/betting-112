import {
	addMoney,
	checkObjectRightCollision, checkObjectLeftCollision, checkObjectTopCollision, checkObjectDownCollision, checkCollision
} from './functions';
import { showFinalScreen } from './finalScreen';
import { openNewLevel } from './initStartData';

// arkanoid


const fieldBody = document.querySelector('.field__body');
const paddle = document.querySelector('.field__paddle') as HTMLElement;
const ball = document.querySelector('.field__ball') as HTMLElement;
const blocks = document.querySelectorAll('.field__block');
const level = document.querySelector('.header__level span') as HTMLElement;
const rowBlocks = document.querySelectorAll('.field__blocks-row');
const hearts = document.querySelectorAll('.game__lives span');


interface IConfigGame {
	state: number;

	points: number;
	blockCost: number;

	level: number;
	constLives: number;
	lives: number;
	figure: IFigure;
	ball: IBall;
	paddle: IPaddle;
	field: IField;
	touch: ITouch;
}

interface IFigure {
	columns: number;
	level_1: ILevel;
	level_2: ILevel;
	level_3: ILevel;
	level_4: ILevel;
}

interface ILevel {
	rows: number;
	mesh: number[];
	gapBottom: number[];
}

interface IBall {
	width: number;
	height: number;
	x: null | number;
	y: number;
	xStep: number;
	yStep: number;
	xTurn: string;
	yTurn: string;
}

interface IPaddle {
	width: number;
	height: number;
	x: null | number;
	xStep: number;
}
interface IField {
	width: null | number;
	height: null | number;
}
interface ITouch {
	xStart: null | number;
	xCurrent: null | number;
}

export const configGame: IConfigGame = {
	state: 1, // 1 - not play, 2 - play game

	points: 0,
	blockCost: 25,

	level: 1,
	constLives: 3,
	lives: 3,

	figure: {
		columns: 12,
		level_1: {
			rows: 12,
			mesh:
				[
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
				],
			gapBottom: [6]
		},
		level_2: {
			rows: 17,
			mesh:
				[
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0,
				],
			gapBottom: [11]
		},
		level_3: {
			rows: 15,
			mesh:
				[
					0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
					0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
					0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
					0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
				],
			gapBottom: [3, 8, 9]
		},
		level_4: {
			rows: 18,
			mesh:
				[
					0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0,
					1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
					0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
					0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
					0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0,
					1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
					0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
					0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
					0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
				],
			gapBottom: [6, 12]
		},
	},

	ball: {
		width: 12,
		height: 12,
		x: null,
		y: -38,
		xStep: 2,
		yStep: 3,//4
		xTurn: 'left',
		yTurn: 'up'
	},
	paddle: {
		width: 96,
		height: 17,
		x: null,
		xStep: 5 // 1
	},
	field: {
		width: null,
		height: null
	},
	touch: {
		xStart: null,
		xCurrent: null
	}
}


export function startGame() {
	//draw start data
	// resetBlocksClasses();
	drawCurrentLevel();

	drawFieldSize();
	drawStartPositionPaddle();
	drawStartPositionBall();
	//==

	configGame.state = 2;
	animateGame(0);
}

export function drawCurrentMesh() {
	resetBlocksClasses();
	if (configGame.level === 1) {
		drawCurrentFigure(configGame.figure.level_1.mesh);
		configGame.figure.level_1.gapBottom.forEach(gapItem => rowBlocks[gapItem - 1].classList.add('_gap-bottom'));
	} else if (configGame.level === 2) {
		drawCurrentFigure(configGame.figure.level_2.mesh);
		configGame.figure.level_2.gapBottom.forEach(gapItem => rowBlocks[gapItem - 1].classList.add('_gap-bottom'));
	} else if (configGame.level === 3) {
		drawCurrentFigure(configGame.figure.level_3.mesh);
		configGame.figure.level_3.gapBottom.forEach(gapItem => rowBlocks[gapItem - 1].classList.add('_gap-bottom'));
	} else if (configGame.level === 4) {
		drawCurrentFigure(configGame.figure.level_4.mesh);
		configGame.figure.level_4.gapBottom.forEach(gapItem => rowBlocks[gapItem - 1].classList.add('_gap-bottom'));
	}
}

function drawCurrentFigure(mesh: number[]) {
	mesh.forEach((number, idx) => {
		if (number > 0) {
			blocks[idx].classList.remove('_hide');
			blocks[idx].setAttribute('data-block-health', number.toString());
		}
	})
}

function drawFieldSize() {
	const wdt = fieldBody?.getBoundingClientRect().width;
	if (wdt) configGame.field.width = wdt;

	const htg = fieldBody?.getBoundingClientRect().height;
	if (htg) configGame.field.height = htg;
}
function drawCurrentLevel() {
	level.textContent = configGame.level.toString();
}

//===
// paddle
function drawStartPositionPaddle() {
	if (configGame.field.width) configGame.paddle.x = configGame.field.width * 0.5 - configGame.paddle.width * 0.5;
	drawPaddleXPosition();
}
function drawPaddleXPosition() {
	paddle.style.transform = `translateX(${configGame.paddle.x}px)`;
}
export function compareTouchPath() {
	if (configGame.touch.xStart && configGame.touch.xCurrent && configGame.touch.xStart > configGame.touch.xCurrent) movePaddle('left');
	else movePaddle('right');
}
function movePaddle(turn: string) {
	if (turn === 'left' && configGame.paddle.x && configGame.paddle.x > -5) {
		configGame.paddle.x -= configGame.paddle.xStep;
	} else if (turn === 'right' && configGame.paddle.x && configGame.field.width && configGame.paddle.x < configGame.field.width + 5 - configGame.paddle.width) {
		configGame.paddle.x += configGame.paddle.xStep;
	}
	drawPaddleXPosition();
}

//=====
// ball
function drawStartPositionBall() {
	if (configGame.field.width && configGame.ball.width) {
		configGame.ball.x = configGame.field.width * 0.5 - configGame.ball.width * 0.5;
		configGame.ball.y = -configGame.paddle.height;
		configGame.ball.xStep = 2;
		configGame.ball.yStep = 3;
		drawBallPosition();
	}
}
function drawBallPosition() {
	ball.style.transform = `translate(${configGame.ball.x}px, ${configGame.ball.y}px)`;
}
function moveBall() {
	const paddleData = paddle.getBoundingClientRect();
	const ballData = ball.getBoundingClientRect();

	if (!configGame.ball.x || !configGame.field.width || !configGame.field.height) return;

	// мяч движется влево и вверх
	if (
		configGame.ball.xTurn === 'left' &&
		configGame.ball.yTurn === 'up' &&
		configGame.ball.x < configGame.field.width - configGame.ball.width &&
		Math.abs(configGame.ball.y) < configGame.field.height - configGame.ball.height
	) {
		configGame.ball.x += configGame.ball.xStep;
		configGame.ball.y -= configGame.ball.yStep;
	}


	else if (
		configGame.ball.xTurn === 'left' &&
		configGame.ball.yTurn === 'up' &&
		configGame.ball.x >= configGame.field.width - configGame.ball.width &&
		Math.abs(configGame.ball.y) < configGame.field.height - configGame.ball.height
	) {
		configGame.ball.xTurn = 'right';
	}

	else if (
		configGame.ball.xTurn === 'left' &&
		configGame.ball.yTurn === 'up' &&
		configGame.ball.x < configGame.field.width - configGame.ball.width &&
		Math.abs(configGame.ball.y) >= configGame.field.height - configGame.ball.height
	) {
		configGame.ball.yTurn = 'down';
	}

	// мяч движется влево и вниз
	else if (
		configGame.ball.xTurn === 'left' &&
		configGame.ball.yTurn === 'down' &&
		configGame.ball.x < configGame.field.width - configGame.ball.width &&
		Math.abs(configGame.ball.y) > configGame.paddle.height - 1
	) {
		configGame.ball.x += configGame.ball.xStep;
		configGame.ball.y += configGame.ball.yStep;
	}

	else if (
		configGame.ball.xTurn === 'left' &&
		configGame.ball.yTurn === 'down' &&
		configGame.ball.x >= configGame.field.width - configGame.ball.width &&
		Math.abs(configGame.ball.y) > configGame.paddle.height - 1
	) {
		configGame.ball.xTurn = 'right';
	}

	else if (
		configGame.ball.xTurn === 'left' &&
		configGame.ball.yTurn === 'down' &&
		configGame.ball.x < configGame.field.width - configGame.ball.width &&
		Math.abs(configGame.ball.y) <= configGame.paddle.height - 1
	) {
		if (checkCollision(paddleData, ballData)) {
			configGame.ball.yTurn = 'up';
			changeXStepWhenTouchPaddle();
		} else if (configGame.lives > 0) {
			configGame.state = 1;
			configGame.lives--;

			drawCurrentLives();
			drawStartPositionsBallAndPaddle();

			setTimeout(() => {
				configGame.state = 2;
				animateGame(0);
			}, 500);
		} else if (configGame.lives <= 0) {
			let losescore = Math.floor(configGame.points * 0.2);
			showFinalScreen(losescore);
			addMoney(losescore, '.score', 1000, 2000);
			stopGame();
		}
	}

	// мяч движется вправо и вверх
	else if (
		configGame.ball.xTurn === 'right' &&
		configGame.ball.yTurn === 'up' &&
		configGame.ball.x > 0 &&
		Math.abs(configGame.ball.y) < configGame.field.height - configGame.ball.height
	) {
		configGame.ball.x -= configGame.ball.xStep;
		configGame.ball.y -= configGame.ball.yStep;
	}

	else if (
		configGame.ball.xTurn === 'right' &&
		configGame.ball.yTurn === 'up' &&
		configGame.ball.x <= 0 &&
		Math.abs(configGame.ball.y) < configGame.field.height - configGame.ball.height
	) {
		configGame.ball.xTurn = 'left';
	}

	else if (
		configGame.ball.xTurn === 'right' &&
		configGame.ball.yTurn === 'up' &&
		configGame.ball.x > 0 &&
		Math.abs(configGame.ball.y) >= configGame.field.height - configGame.ball.height
	) {
		configGame.ball.yTurn = 'down';
	}

	// мяч движется вправо и вниз
	else if (
		configGame.ball.xTurn === 'right' &&
		configGame.ball.yTurn === 'down' &&
		configGame.ball.x > 0 &&
		Math.abs(configGame.ball.y) > configGame.paddle.height - 1
	) {
		configGame.ball.x -= configGame.ball.xStep;
		configGame.ball.y += configGame.ball.yStep;
	}

	else if (
		configGame.ball.xTurn === 'right' &&
		configGame.ball.yTurn === 'down' &&
		configGame.ball.x <= 0 &&
		Math.abs(configGame.ball.y) > configGame.paddle.height - 1
	) {
		configGame.ball.xTurn = 'left';
	}

	else if (
		configGame.ball.xTurn === 'right' &&
		configGame.ball.yTurn === 'down' &&
		configGame.ball.x > 0 &&
		Math.abs(configGame.ball.y) <= configGame.paddle.height - 1
	) {
		if (checkCollision(paddleData, ballData)) {
			configGame.ball.yTurn = 'up';
			changeXStepWhenTouchPaddle();
		} else if (configGame.lives > 0) {
			configGame.state = 1;
			configGame.lives--;

			drawCurrentLives();
			drawStartPositionsBallAndPaddle();

			setTimeout(() => {
				configGame.state = 2;
				animateGame(0);
			}, 500);
		} else if (configGame.lives <= 0) {
			let losescore = Math.floor(configGame.points * 0.2);
			showFinalScreen(losescore);
			addMoney(losescore, '.score', 1000, 2000);
			stopGame();
		}

	}
	drawBallPosition();

	const colision = checkBlockCollision();
	if (colision) {
		if (colision.turn === 'left') {
			configGame.ball.xTurn = 'right';
		} else if (colision.turn === 'right') {
			configGame.ball.xTurn = 'left';
		} else if (colision.turn === 'top') {
			configGame.ball.yTurn = 'up';
		} else if (colision.turn === 'bottom') {
			configGame.ball.yTurn = 'down';
		}

		let healthBlock = Number(colision.item.getAttribute('data-blockHealth'));

		if (healthBlock === 1) {
			colision.item.classList.add('_hide');
			configGame.points += configGame.blockCost;
		} else {
			healthBlock--;
			colision.item.setAttribute('data-block-health', healthBlock.toString());
		}
	}
}
function checkBlockCollision() {
	for (let i = 0; i < blocks.length; i++) {
		if (!blocks[i].classList.contains('_hide')) {
			const fruitData = blocks[i].getBoundingClientRect();
			const ballData = ball.getBoundingClientRect();
			if (checkCollision(fruitData, ballData)) {
				if (checkObjectRightCollision(fruitData, ballData)) {
					return { turn: 'right', item: blocks[i] };
				}
				else if (checkObjectLeftCollision(fruitData, ballData)) {
					return { turn: 'left', item: blocks[i] };
				}
				else if (checkObjectTopCollision(fruitData, ballData)) {
					return { turn: 'top', item: blocks[i] };
				}
				else if (checkObjectDownCollision(fruitData, ballData)) {
					return { turn: 'bottom', item: blocks[i] };
				}
			}
		}
	}
}
function changeXStepWhenTouchPaddle() {
	const ballData = ball.getBoundingClientRect();
	const paddleData = paddle.getBoundingClientRect();

	const xPaddleCoord = paddleData.left;
	const xBallCoordInPaddle = ballData.left - xPaddleCoord;

	const percent = ((xBallCoordInPaddle + ballData.width * 0.5) / paddleData.width) * 100;

	if (percent <= 15) {
		configGame.ball.xStep = 5;
		configGame.ball.xTurn = 'right';
	} else if (percent >= 85) {
		configGame.ball.xStep = 5;
		configGame.ball.xTurn = 'left';
	}
	else if (percent > 15 && percent <= 35) {
		configGame.ball.xStep = 2;
		configGame.ball.xTurn = 'right';
	}
	else if (percent < 85 && percent >= 65) {
		configGame.ball.xStep = 2;
		configGame.ball.xTurn = 'left';
	}
	else if (percent > 35 && percent <= 50) {
		configGame.ball.xStep = 0.5;
		configGame.ball.xTurn = 'right';
	}
	else if (percent > 50 && percent < 65) {
		configGame.ball.xStep = 0.5;
		configGame.ball.xTurn = 'left';
	}
}

function checkWinGame() {
	let activeBlocks = 0;
	blocks.forEach(block => {
		if (!block.classList.contains('_hide')) activeBlocks++;
	})

	if (activeBlocks <= 0) {
		addMoney(configGame.points, '.score', 1000, 2000);
		showFinalScreen(configGame.points, 'win');
		stopGame();

		let currentLevel = Number(localStorage.getItem('opened-level'));
		if (configGame.level === currentLevel && currentLevel < 4) {
			currentLevel++;
			localStorage.setItem('opened-level', currentLevel.toString());
			openNewLevel();
		}
	}
}

function drawCurrentLives() {
	hearts.forEach(heart => heart.classList.add('_hide'));

	for (let i = 0; i < configGame.lives; i++) {
		hearts[i].classList.remove('_hide');
	}
}


function animateGame(timestamp: number) {
	moveBall();
	checkWinGame();

	if (configGame.state === 2) requestAnimationFrame(animateGame);
}

export function resetGameData() {
	configGame.points = 0;
	configGame.ball.xTurn = 'left';
	configGame.ball.yTurn = 'up';
	configGame.lives = configGame.constLives;

	drawCurrentLives();
}

function drawStartPositionsBallAndPaddle() {
	configGame.ball.xTurn = 'left';
	configGame.ball.yTurn = 'up';
	drawStartPositionBall();
	drawStartPositionPaddle();
}



export function stopGame() {
	configGame.state = 1;
	resetGameData();
}

function resetBlocksClasses() {
	blocks.forEach(block => block.setAttribute('class', 'field__block _hide'));
	rowBlocks.forEach(block => block.setAttribute('class', 'field__blocks-row'));
}