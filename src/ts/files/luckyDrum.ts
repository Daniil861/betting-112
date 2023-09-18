import { deleteMoney, addMoney, addRemoveClass, getRandom } from "./functions";


//========================================================================================================================================================
//game-drum

export const config_game = {
	state: 1, // 1 - not play, 2 - play
	last_rotate: 0,
	count_win: 0,
	priceStep: 50,
	coeffWin: 5,
	userSelect: ''
}

const circleDrumBox = document.querySelector('.circle__drum-box') as HTMLElement;

export function rotateDrum() {
	config_game.last_rotate += getRandom(100, 2000);
	circleDrumBox.style.transform = `rotate(${config_game.last_rotate}deg)`;
	circleDrumBox.style.transition = '2s';
}

export function getTargetBlock() {
	let arrow_top = document.querySelector('.circle__dot')?.getBoundingClientRect().top;
	let arrow_left = document.querySelector('.circle__dot')?.getBoundingClientRect().left;

	let target_block2: Element;
	if (arrow_top && arrow_left) {
		const el = document.elementFromPoint(arrow_left, arrow_top);
		if (el) {
			target_block2 = el;
			return target_block2;
		}
	}

	return false;
}

export function checkTargetItem(block: Element) {

	const value = block.getAttribute('data-target');

	if (value != 'repeat') {
		if (config_game.userSelect == value) {
			const winCount = config_game.priceStep * config_game.coeffWin;
			addMoney(winCount, '.score', 1000, 2000);
		}
		removeHoldButtons();
	} else if (value == 'repeat') {
		const money = Number(localStorage.getItem('money'));
		if (money >= config_game.priceStep) {

			rotateDrum();

			holdButtons();

			setTimeout(() => {
				const block = getTargetBlock();
				if (block) checkTargetItem(block);
			}, 2100);
		}
	}
}

function holdButtons() {
	document.querySelectorAll('[data-lucky]').forEach(button => {
		button.classList.add('_hold');
		if (button.getAttribute('data-lucky') == config_game.userSelect) button.classList.add('_active');
	});
}

function removeHoldButtons() {
	document.querySelectorAll('[data-lucky]').forEach(button => {
		button.classList.remove('_hold');
		if (button.classList.contains('_active')) button.classList.remove('_active');
	});
}

document.addEventListener('click', (e) => {
	const targetElement = e.target as HTMLElement;

	const money = Number(localStorage.getItem('money'));
	const wrapper = document.querySelector('.wrapper');


	if (targetElement.closest('[data-button="drum-home"]')) {
		wrapper?.classList.remove('_drum');
	}

	if (targetElement.closest('[data-button="drum"]')) {
		wrapper?.classList.add('_drum');
	}

	//========================================================================================================================================================
	//game
	if (targetElement.closest('[data-lucky]')) {
		if (money >= config_game.priceStep) {
			const dataLucky = targetElement.closest('[data-lucky]')?.getAttribute('data-lucky');
			if (dataLucky) config_game.userSelect = dataLucky;

			deleteMoney(config_game.priceStep, '.score', 'money');
			rotateDrum();

			holdButtons();

			setTimeout(() => {
				const block = getTargetBlock();
				if (block) checkTargetItem(block);
			}, 2100);
		}
	}
	//========================================================================================================================================================

})