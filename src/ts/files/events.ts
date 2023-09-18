
import { configGame, drawUserSelect, generateBotSelect, startGame, userStepGoing, resetGame } from './script';

// Объявляем слушатель событий "клик"
document.addEventListener('click', (e) => {

	const wrapper = document.querySelector('.wrapper');

	const targetElement = e.target as HTMLElement;

	const money = Number(localStorage.getItem('money'));
	const bet = Number(localStorage.getItem('current-bet'));

	// privacy screen
	if (targetElement.closest('.preloader__button')) {
		location.href = 'main.html';
	}

	// main screen
	if (targetElement.closest('[data-button="privacy"]')) {
		location.href = 'index.html';
	}

	if (targetElement.closest('[data-button="characters"]')) {
		wrapper?.classList.add('_characters');
	}

	if (targetElement.closest('[data-button="characters-home"]')) {
		wrapper?.setAttribute('class', 'wrapper');
	}

	if (configGame.state === 2 && (configGame.currentStep === 1 || configGame.currentStep === 3)) {
		userStepGoing();
	}

	if (targetElement.closest('[data-button="play"]')) {
		const number = targetElement.closest('[data-character]')?.getAttribute('data-character');

		if (number) {
			configGame.userImage = number;
			wrapper?.setAttribute('class', 'wrapper _game');
			drawUserSelect();
			generateBotSelect();

			startGame();
		}

	}

	if (targetElement.closest('[data-button="game-home"]')) {
		wrapper?.setAttribute('class', 'wrapper');
		setTimeout(() => {
			resetGame();
		}, 500);
	}


})
