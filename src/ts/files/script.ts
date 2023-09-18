import { addMoney, getRandom } from "./functions";
import { checkBoughtBuster } from "./shop";

// 1. кликаем по персонажу
//	2. Запускаем функцию начала игры:
//		2.1 Изменяем состояние на 2 - означает попытка игрока
//	++		2.1.2 В это время анимируем блок с игроком (немного подпрыгивает)
//		2.2 Кликаем по экрану
//	++		2.2.1  Генерируем случайное число от 10 до 100 - число соответствует первой попытке	
//			2.2.2 Посылаем мяч на такое количество процентов
//	++		2.2.2 В блок с попыткой 1 записываем процент
//		2.3 Переводим состояние в положение 3 - попытка бота
//			2.3.1 Генерируем случайное число от 10 до 100 - число соответствует второй попытке	
//			2.3.2 Посылаем мяч на такое количество процентов
//			2.3.3 В блок с попыткой 2 записываем процент
// ...
//		3. После каждой попытки проверяем какая попытка выполнена, увеличиваем на один и активируем следующий стейт
//		4. Если была попытка 4 - проверяем сколько набрал суммарно игрок и сколько бот:
//			4.1 Если игрок больше - увеличиваем банк и выходим в главное меню
//			4.2 Если бот больше - просто возвращаемся в главное меню
//		-- Если куплен бустер - тогда сила броска игрока начинается от 40, а не от 10.


export const configGame = {
	state: 1, // 1 - not play, 2 - play

	winCount: 250,

	userImage: '1',
	botImage: '2',
	constArrImages: [1, 2, 3],
	selectImages: [1, 2, 3],

	currentStep: 1,

	user: {
		step_1: 0,
		step_2: 0
	},
	bot: {
		step_1: 0,
		step_2: 0
	},
}

const userItem = document.querySelector('[data-player="1"]');
const botItem = document.querySelector('[data-player="2"]');

const userImage = document.querySelector('[data-player="1"] .item-players-game__image img');
const botImage = document.querySelector('[data-player="2"] .item-players-game__image img');

const userName = document.querySelector('[data-player="1"] .item-players-game__name');
const botName = document.querySelector('[data-player="2"] .item-players-game__name');

const stepBox1 = document.querySelector('[data-chance="0"]');
const stepBox2 = document.querySelector('[data-chance="1"]');
const stepBox3 = document.querySelector('[data-chance="2"]');
const stepBox4 = document.querySelector('[data-chance="3"]');

const ball1 = document.querySelector('[data-ball="1"]') as HTMLElement;
const ball2 = document.querySelector('[data-ball="2"]') as HTMLElement;
const ball3 = document.querySelector('[data-ball="3"]') as HTMLElement;
const ball4 = document.querySelector('[data-ball="4"]') as HTMLElement;

const gameScore = document.querySelector('.display__game-score');
const displayLength = document.querySelector('.display__length');

const dataWin = document.querySelector('[data-point="win"]');
const dataBalls = document.querySelector('[data-point="balls"]');

export function drawUserSelect() {
	userImage?.setAttribute('src', `img/characters/character-${configGame.userImage}.png`);
	if (userName) userName.textContent = `Player 0${configGame.userImage}`;
}

export function generateBotSelect() {
	const userSelect = Number(configGame.userImage);
	const arr = [...configGame.selectImages];

	const idx = configGame.selectImages.indexOf(userSelect);

	arr.splice(idx, 1);

	configGame.botImage = arr[getRandom(0, 2)].toString();

	drawBotSelect();
}

function drawBotSelect() {
	botImage?.setAttribute('src', `img/characters/character-${configGame.botImage}.png`);
	if (botName) botName.textContent = `Player 0${configGame.botImage}`;
}


export function startGame() {
	configGame.state = 2;

	checkWhomStep();

}

function checkWhomStep() {
	if (userItem && (configGame.currentStep === 1 || configGame.currentStep === 3)) {
		// попытка игрока
		if (botItem?.classList.contains('_active')) botItem?.classList.remove('_active');
		userItem.classList.add('_active');

	}
	if (botItem && (configGame.currentStep === 2 || configGame.currentStep === 4)) {
		// попытка бота
		if (userItem?.classList.contains('_active')) userItem?.classList.remove('_active');
		botItem.classList.add('_active');
	}
}

export function userStepGoing() {

	generateUserStep();
	setTimeout(() => {
		// Запуск мяча
		moveBall();
	}, 500);

	setTimeout(() => {
		// Обновление результатов
		drawDataCurrentStep();
	}, 1000);

	setTimeout(() => {
		// переход хода
		if (configGame.currentStep < 4) {
			configGame.currentStep++;
			checkWhomStep();

			botStepGoing();
		} else {

		}
	}, 1500);
}


function botStepGoing() {
	generateBotStep();

	setTimeout(() => {
		// Запуск мяча
		moveBall();
	}, 500);

	setTimeout(() => {
		// Обновление результатов
		drawDataCurrentStep();
	}, 1000);

	setTimeout(() => {
		// переход хода
		if (configGame.currentStep < 4) {
			configGame.currentStep++;
			checkWhomStep();
		} else {
			if (botItem?.classList.contains('_active')) botItem?.classList.remove('_active');

			stopGame();
			checkWinnerGame();

			setTimeout(() => {
				document.querySelector('.wrapper')?.setAttribute('class', 'wrapper');
			}, 1000);
			setTimeout(() => {
				resetGame();
			}, 1500);
		}
	}, 1500);
}

function generateUserStep() {
	let minNumber = 10;

	const buster = localStorage.getItem('buster');

	if (buster && buster === '1') {
		minNumber = 70;
		localStorage.setItem('buster', '0');
		checkBoughtBuster();
	}

	const number = getRandom(minNumber, 100);

	if (configGame.user.step_1 > 0) configGame.user.step_2 = number;
	else configGame.user.step_1 = number;
}

function generateBotStep() {

	const number = getRandom(10, 100);

	if (configGame.bot.step_1 > 0) configGame.bot.step_2 = number;
	else configGame.bot.step_1 = number;

}

function moveBall() {
	if (configGame.currentStep === 1 && ball1) {
		ball1.style.bottom = `${configGame.user.step_1}%`;
	}
	if (configGame.currentStep === 2 && ball2) {
		ball2.style.bottom = `${configGame.bot.step_1}%`;
	}
	if (configGame.currentStep === 3 && ball3) {
		ball3.style.bottom = `${configGame.user.step_2}%`;
	}
	if (configGame.currentStep === 4 && ball4) {
		ball4.style.bottom = `${configGame.bot.step_2}%`;
	}
}

function drawDataCurrentStep() {

	if (configGame.currentStep === 1 && stepBox1) {
		const countItem = stepBox1.querySelector('.percent-box__count');
		const innerPerc = stepBox1.querySelector('.percent-box__rect-inner') as HTMLElement;

		if (countItem) countItem.textContent = `${configGame.user.step_1}%`;
		if (configGame.user.step_1 < 50) innerPerc.classList.add('_low');
		innerPerc.style.width = `${configGame.user.step_1}%`;

		if (gameScore) gameScore.textContent = `1/0`;
		if (displayLength) displayLength.textContent = configGame.user.step_1.toString();
		if (dataWin) dataWin.textContent = configGame.user.step_1.toString();
	}

	if (configGame.currentStep === 2 && stepBox2) {
		const countItem = stepBox2.querySelector('.percent-box__count');
		const innerPerc = stepBox2.querySelector('.percent-box__rect-inner') as HTMLElement;

		if (countItem) countItem.textContent = `${configGame.bot.step_1}%`;
		if (configGame.bot.step_1 < 50) innerPerc.classList.add('_low');
		innerPerc.style.width = `${configGame.bot.step_1}%`;

		if (gameScore) gameScore.textContent = `1/1`;
		if (displayLength) displayLength.textContent = configGame.bot.step_1.toString();
		if (dataBalls) dataBalls.textContent = configGame.bot.step_1.toString();
	}

	if (configGame.currentStep === 3 && stepBox3) {
		const countItem = stepBox3.querySelector('.percent-box__count');
		const innerPerc = stepBox3.querySelector('.percent-box__rect-inner') as HTMLElement;

		if (countItem) countItem.textContent = `${configGame.user.step_2}%`;
		if (configGame.user.step_2 < 50) innerPerc.classList.add('_low');
		innerPerc.style.width = `${configGame.user.step_2}%`;

		if (gameScore) gameScore.textContent = `2/1`;
		if (displayLength) displayLength.textContent = configGame.user.step_2.toString();
		if (dataWin) dataWin.textContent = (configGame.user.step_1 + configGame.user.step_2).toString();
	}

	if (configGame.currentStep === 4 && stepBox4) {
		const countItem = stepBox4.querySelector('.percent-box__count');
		const innerPerc = stepBox4.querySelector('.percent-box__rect-inner') as HTMLElement;

		if (countItem) countItem.textContent = `${configGame.bot.step_2}%`;
		if (configGame.bot.step_2 < 50) innerPerc.classList.add('_low');
		innerPerc.style.width = `${configGame.bot.step_2}%`;

		if (gameScore) gameScore.textContent = `2/2`;
		if (displayLength) displayLength.textContent = configGame.bot.step_2.toString();
		if (dataBalls) dataBalls.textContent = (configGame.bot.step_1 + configGame.bot.step_2).toString();
	}
}

function checkWinnerGame() {
	const userPoints = configGame.user.step_1 + configGame.user.step_2;
	const botPoints = configGame.bot.step_1 + configGame.bot.step_2;

	if (userPoints >= botPoints) {
		addMoney(configGame.winCount, '.score', 0, 1000);
	}
}

function stopGame() {
	configGame.state = 1;
}

export function resetGame() {
	stopGame();

	if (stepBox1) {
		const countItem = stepBox1.querySelector('.percent-box__count');
		const innerPerc = stepBox1.querySelector('.percent-box__rect-inner') as HTMLElement;

		if (countItem) countItem.textContent = `0%`;
		if (innerPerc.classList.contains('_low')) innerPerc.classList.add('_low');
		innerPerc.style.width = `0%`;
	}
	if (stepBox2) {
		const countItem = stepBox2.querySelector('.percent-box__count');
		const innerPerc = stepBox2.querySelector('.percent-box__rect-inner') as HTMLElement;

		if (countItem) countItem.textContent = `0%`;
		if (innerPerc.classList.contains('_low')) innerPerc.classList.add('_low');
		innerPerc.style.width = `0%`;
	}
	if (stepBox3) {
		const countItem = stepBox3.querySelector('.percent-box__count');
		const innerPerc = stepBox3.querySelector('.percent-box__rect-inner') as HTMLElement;

		if (countItem) countItem.textContent = `0%`;
		if (innerPerc.classList.contains('_low')) innerPerc.classList.add('_low');
		innerPerc.style.width = `0%`;
	}
	if (stepBox4) {
		const countItem = stepBox4.querySelector('.percent-box__count');
		const innerPerc = stepBox4.querySelector('.percent-box__rect-inner') as HTMLElement;

		if (countItem) countItem.textContent = `0%`;
		if (innerPerc.classList.contains('_low')) innerPerc.classList.add('_low');
		innerPerc.style.width = `0%`;
	}

	resetDataGame();

	ball1.style.bottom = `0%`;
	ball2.style.bottom = `0%`;
	ball3.style.bottom = `0%`;
	ball4.style.bottom = `0%`;

	if (gameScore) gameScore.textContent = '0/0';
	if (displayLength) displayLength.textContent = '0';

	if (dataWin) dataWin.textContent = '0';
	if (dataBalls) dataBalls.textContent = '0';


}
function resetDataGame() {
	configGame.currentStep = 1;

	configGame.user.step_1 = 0;
	configGame.user.step_2 = 0;

	configGame.bot.step_1 = 0;
	configGame.bot.step_2 = 0;
}

// export { };