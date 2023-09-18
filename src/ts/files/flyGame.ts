import { addMoney, deleteMoney, getRandom } from './functions';
// game

// Изначально длина 0м и полоска на нуле
// Максимально длина может быть 100 м
// ++1. Кликаем на кнопку начать:
//	++2. Генерируем случайное число от 10 до 100
//	++3. Переводим состояние игры в положение 2
// ++	4. Запускаем анимацию полета
// ++	5. Анимируем полет игрока
//	6. Анимируем увеличение метров в инфо
//	7. Анимируем движение полоски в блоке инфо

export const gameConfig = {
	status: 1, // 1 - no fly, 2 - fly

	yOffset: 0,
	countOffset: 0.1,
	stepOffset: 0.02,

	lengthPath: 0, // сохраняем расстояние от игрока до блока с информацией пути. Для определения максимальной длины пути

	randomNumber: 0, // длина, на которую полетит игрок
}
const startButton = document.querySelector('[data-button="fly-start"]');
const betBoxFly = document.querySelector('.fly-game__footer .bet-box');
const player = document.querySelector('.fly-game__player') as HTMLElement;
const info = document.querySelector('.fly-game__info');
const gameCount = document.querySelector('.fly-game__count-box') as HTMLElement;
const game = document.querySelector('.fly-game');

export function startFly() {
	getPath();
	// Блокируем кнопку
	startButton?.classList.add('_hold');
	betBoxFly?.classList.add('_hold');

	deleteMoney(Number(localStorage.getItem('current-bet')), '.score');

	// Переводим игру в положение полет
	gameConfig.status = 2;

	// Генерируем случайное число - длину полета
	gameConfig.randomNumber = getRandom(10, 100);

	animateFlyGame();
}

function getPath() {
	const topCoord = info?.getBoundingClientRect().top;
	const startCoord = player.getBoundingClientRect().top;
	if (topCoord && startCoord) gameConfig.lengthPath = startCoord - topCoord;
}

if (document.querySelector('.game')) {
	window.addEventListener('resize', () => {
		getPath();
	})
}

function translatePercentToPath(percent: number) {
	return (percent * gameConfig.lengthPath) / 100;
}

function animateCountFly() {
	gameCount.textContent = `x${(gameConfig.yOffset / 10).toFixed(2)}`;
}
function resetCountFly() {
	gameCount.textContent = `x0`;
}

function resetPosPlayer() {
	player.style.transform = `translateX(-50%) translateY(0px)`;
}

function animateFlyGame() {

	gameConfig.yOffset += gameConfig.countOffset;
	gameConfig.countOffset += gameConfig.stepOffset;
	const path = translatePercentToPath(gameConfig.yOffset);

	player.style.transform = `translateX(-50%) translateY(${-path}px)`;

	animateCountFly();

	if (gameConfig.yOffset < gameConfig.randomNumber) {
		requestAnimationFrame(animateFlyGame);
	} else {
		const winCount = Math.floor(Number(localStorage.getItem('current-bet')) * gameConfig.yOffset / 10);
		addMoney(winCount, '.score', 500, 1500);
		setTimeout(() => {
			loadingNewRound();
		}, 1500);
		setTimeout(() => {
			resetFlyGame();
		}, 2000);
		setTimeout(() => {
			removeLoadingNewRound();
			startButton?.classList.remove('_hold');
			betBoxFly?.classList.remove('_hold');
		}, 5000);
	}



}
function loadingNewRound() {
	game?.classList.add('_new-round');
}

function removeLoadingNewRound() {
	game?.classList.remove('_new-round');
}

export function resetFlyGame() {
	gameConfig.status = 1;
	gameConfig.yOffset = 0;
	gameConfig.countOffset = 0.1;

	gameConfig.randomNumber = 0;

	resetCountFly();
	resetPosPlayer();
}

// Объявляем слушатель событий "клик"
document.addEventListener('click', (e) => {
	const targetElement = e.target as HTMLElement;

	if (targetElement.closest('[data-button="fly-start"]')) {
		startFly();
	}

})
