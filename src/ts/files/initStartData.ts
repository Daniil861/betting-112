import { getDigFormat } from './functions';
import { startData } from './startData';



export function initStartData() {

	if (!localStorage.getItem('money')) {
		localStorage.setItem('money', startData.bank.toString());
	}
	writeScore();


	if (!localStorage.getItem('current-bet')) {
		localStorage.setItem('current-bet', startData.countBet.toString());
	}
	writeBet();

	// if (!localStorage.getItem('level')) {
	// 	localStorage.setItem('level', '1');
	// }

	// if (!localStorage.getItem('opened-level')) {
	// 	localStorage.setItem('opened-level', '1');
	// }
	// openNewLevel();
}


function writeScore() {
	if (document.querySelectorAll('.score').length) {
		let money = getDigFormat(Number(localStorage.getItem('money')));
		document.querySelectorAll('.score').forEach(el => {
			el.textContent = money;
		})
	}
}

export function writeBet() {
	if (document.querySelector(startData.nameItemBet)) {
		document.querySelectorAll(startData.nameItemBet).forEach(el => {
			el.textContent = localStorage.getItem('current-bet');
		})
	}
}

export function openNewLevel() {
	const levelsBlocks = document.querySelectorAll('[data-level]');
	const openedLevels = Number(localStorage.getItem('opened-level'));
	if (levelsBlocks.length) {
		for (let i = 0; i < openedLevels; i++) {
			if (levelsBlocks[i].classList.contains('_disabled')) levelsBlocks[i].classList.remove('_disabled');
		}
	}
}


initStartData();