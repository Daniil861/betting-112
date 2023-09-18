import { startData } from './startData';
import { writeBet } from './initStartData';
import { noMoney } from './functions';

document.addEventListener('click', (e) => {

	const targetElement = e.target as HTMLElement;

	const money = Number(localStorage.getItem('money'));
	const currentBet = Number(localStorage.getItem('current-bet'));

	if (targetElement.closest('[data-button="bet-minus"]') && currentBet > startData.countBet) {
		localStorage.setItem('current-bet', (currentBet - startData.countBet).toString());
		writeBet();
	}

	if (targetElement.closest('[data-button="bet-plus"]') && money > currentBet + startData.countBet && currentBet < startData.maxBet) {
		localStorage.setItem('current-bet', (currentBet + startData.countBet).toString());
		writeBet();
	}

	if (targetElement.closest('[data-button="max-bet"]')) {
		if (money > startData.maxBet) {
			localStorage.setItem('current-bet', startData.maxBet.toString());
		}
		else if (money < startData.maxBet && money > startData.countBet + 100) {
			const num = money - (money % 5);
			localStorage.setItem('current-bet', (num - 100).toString());
		} else if (money < startData.countBet + 100) noMoney('.score');

		writeBet();
	}

	if (targetElement.closest('[data-button="bet-min"]') && money > startData.countBet) {
		localStorage.setItem('current-bet', (startData.countBet).toString());
		writeBet();
	}

	if (targetElement.closest('[data-button="bet-reset"]') && money > startData.countBet) {
		localStorage.setItem('current-bet', startData.countBet.toString());
		writeBet();
	}

	if (targetElement.closest('[data-button="bet-semi"]')) {
		if (Math.round(currentBet * 0.5) > 50) {
			localStorage.setItem('current-bet', Math.round(currentBet * 0.5).toString());
			writeBet();
		}
	}

	if (targetElement.closest('[data-button="bet-x2"]')) {

		if (currentBet * 2 < money) {
			localStorage.setItem('current-bet', (currentBet * 2).toString());
			writeBet();
		} else noMoney('.score');
	}

	if (targetElement.closest('[data-bet="50"]')) {
		if (money - 49 > currentBet) {
			localStorage.setItem('current-bet', (currentBet + 50).toString());
			writeBet();
		} else {
			noMoney('.score');
		}
	}

	if (targetElement.closest('[data-bet="100"]')) {
		if (money - 99 > currentBet) {
			localStorage.setItem('current-bet', (currentBet + 100).toString());
			writeBet();
		} else {
			noMoney('.score');
		}
	}

	if (targetElement.closest('[data-bet="200"]')) {
		if (money - 199 > currentBet) {
			localStorage.setItem('current-bet', (currentBet + 200).toString());
			writeBet();
		} else {
			noMoney('.score');
		}
	}

	if (targetElement.closest('[data-bet="500"]')) {
		if (money - 499 > currentBet) {
			localStorage.setItem('current-bet', (currentBet + 500).toString());
			writeBet();
		} else {
			noMoney('.score');
		}
	}

})