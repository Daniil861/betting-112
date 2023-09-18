import { addMoney, deleteMoney, getRandom, getRandomNumArr } from './functions';

// sapper


export const configSapper = {
	state: 1, // 1 - not playing, 2 - playing

	allItems: 49, // начиная с нулевого индекса - если всего блоков 15 то ставим в значении 14
	countBombs: 8,

	constGoodBlocks: 42,
	currentGoodBlocks: 42,

	currentCoeff: 0, // начальный выигрышный коэффициент
	stepUpCoeff: 0.2, // каждый правильно открытый блок увеличивает победный коэффициент
}

const betBoxSapper = document.querySelector('.footer__bet-box');
const buttonStartSapper = document.querySelector('[data-button="sapper-start"]');

export function startGame() {
	holdActions();

	deleteMoney(Number(localStorage.getItem('current-bet')), '.score');

	configSapper.state = 2;
}

//===
function holdActions() {
	holdBetBoxSapp();
	holdButtonStartSapp();
}

function removeHoldActions() {
	removeHoldBetBoxSapp();
	removeHoldButtonStartSapp();
}

function holdBetBoxSapp() {
	betBoxSapper?.classList.add('_hold');
}
function removeHoldBetBoxSapp() {
	betBoxSapper?.classList.remove('_hold');
}
function holdButtonStartSapp() {
	buttonStartSapper?.classList.add('_hold');
}
function removeHoldButtonStartSapp() {
	buttonStartSapper?.classList.remove('_hold');
}

//==
// Генерируем случайные числа
function generateIndexesBombs() {
	let randomArr = getRandomNumArr(0, configSapper.allItems, configSapper.countBombs);
	return randomArr;
}

export function markItemsBombs() {
	const bombs = generateIndexesBombs();

	const items = document.querySelectorAll('[data-bomb]');

	for (let i = 0; i < bombs.length; i++) {
		items[bombs[i]].setAttribute('data-bomb', 'true');
	}

}
//==

function openItem(block: Element, res: string) {
	if (res == 'true') {
		block.classList.add('_lose');
		block.querySelector('img')?.setAttribute('src', 'img/sapper/sapper-2.png');
	} else if (res == 'false') {
		block.classList.add('_win');
		block.querySelector('img')?.setAttribute('src', 'img/sapper/sapper-1.png');
	}
}

export function checkCollision(block: Element) {

	configSapper.currentGoodBlocks--;

	const res = block.getAttribute('data-bomb');
	if (res) openItem(block, res);

	const money = configSapper.currentCoeff * Number(localStorage.getItem('current-bet'));

	if (res == 'false') {
		upCurrentCoeff();
	} else if (res == 'true') {
		stopGameSupper();
		if (configSapper.currentGoodBlocks < configSapper.constGoodBlocks - 1) addMoney(money, '.score', 500, 1500);

		setTimeout(() => {
			resetGame();
			markItemsBombs();
		}, 1500);
	}

	if (configSapper.currentGoodBlocks <= 0) {
		stopGameSupper();
		addMoney(money, '.score', 500, 1500);
		setTimeout(() => {
			resetGame();
			markItemsBombs();
		}, 1500);
	}
}
function stopGameSupper() {
	configSapper.state = 1;
}

function upCurrentCoeff() {
	configSapper.currentCoeff += configSapper.stepUpCoeff;
}

function closeItems() {
	const items = document.querySelectorAll('[data-bomb]');
	items.forEach(item => {
		item.setAttribute('data-bomb', 'false');
		if (item.classList.contains('_win')) item.classList.remove('_win');
		if (item.classList.contains('_lose')) item.classList.remove('_lose');

	});
}

export function resetGame() {
	closeItems();
	removeHoldActions();

	stopGameSupper();

	configSapper.currentGoodBlocks = configSapper.constGoodBlocks;
	configSapper.currentCoeff = 0;

	resetMarkItemsBombs();
}

function resetMarkItemsBombs() {
	const items = document.querySelectorAll('[data-bomb]');
	items.forEach(item => item.setAttribute('data-bomb', 'false'));
}

document.addEventListener('click', (e) => {
	const targetElement = e.target as HTMLElement;

	if (targetElement.closest('[data-button="sapper-start"]') && configSapper.state === 1) {
		startGame();
	}

	if (targetElement.closest('[data-bomb]') && configSapper.state === 2) {
		const bombItem = targetElement.closest('[data-bomb]');
		if (bombItem) checkCollision(bombItem);
	}
})