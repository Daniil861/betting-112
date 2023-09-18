import { addMoney, checkRemoveClass, checkRemoveAddClass, deleteMoney, noMoney } from './functions.js';
import { bestScores, updateBestScoresTable } from './reDrawTableData';

//========================================================================================================================================================
// quiz
const wrapper = document.querySelector('.wrapper');
const quizBody = document.querySelector('.quiz__body');
const gameItems = document.querySelector('.answer-box__body');
const headerQuestion = document.querySelector('.quiz__question') as HTMLElement;
const dataItems = document.querySelectorAll('[data-quiz-item]');
const quizNumberQuestion = document.querySelector('.quiz__number-question span') as HTMLElement;
const progressBarInner = document.querySelector('.progress-bar__inner') as HTMLElement;
const quizButton = document.querySelector('[data-button="quiz-continue"]');
const clueButton = document.querySelector('[data-button="quiz-clue"]');



export const configQuiz = {
	dificulaty: 'ease', // ease or hard
	quizGame: 1,

	currentQuestion: 1,

	playerSelect: 0,
	isClueActive: false,

	upBankCount: 50,

	maxQuestions: 3,

	questions: {
		quiz_1: {
			1: {
				image: 'img/quiz/forest/quiz-1.png',
				variants: ['Chestnut', 'Oak', 'Willow', 'Birch'],
				answer: 2
			},
			2: {
				image: 'img/quiz/forest/quiz-2.png',
				variants: ['Chestnut', 'Birch', 'Willow', 'Pine'],
				answer: 2
			},
			3: {
				image: 'img/quiz/forest/quiz-3.png',
				variants: ['Chestnut', 'Pine', 'Willow', 'Birch'],
				answer: 2
			}
		},
		quiz_2: {
			1: {
				text: 'What is Mark Twain`s real name?',
				variants: ['Samuel Clemens', 'Samuel', 'Markus', 'Twain'],
				answer: 1
			},
			2: {
				text: 'What is the name of the novel by A. Dumas (son), on the plot of which Verdi`s opera La Traviata was written?',
				variants: ['"The Lady with camellias"', 'The Lady with dog', 'The Lady with Boss', 'The Lady '],
				answer: 1
			},
			3: {
				text: 'In different countries IT was called the apple: in France — the apple of love, in Germany — the apple of paradise, and in Italy, whose name we adopted, — the golden apple. The Aztecs called IT simply — "large berry", which, by the way, is more correct from the point of view of botany. Name IT.',
				variants: ['Tomato', 'Apple', 'Сucumber', 'Plum'],
				answer: 1
			}
		},
	}
}

function drawStatusClue() {
	if (configQuiz.isClueActive) {
		clueButton?.setAttribute('class', 'header__clue _active');
	} else {
		clueButton?.setAttribute('class', 'header__clue');
	}
}

function useClueQuiz() {
	configQuiz.isClueActive = false;
	drawStatusClue();
	document.querySelector('[data-button="clue"]')?.classList.remove('_hold');

	let numberCorrectAnswer: number = 1;

	if (configQuiz.quizGame === 1) {
		if (configQuiz.currentQuestion === 1) {
			numberCorrectAnswer = configQuiz.questions.quiz_1[1].answer;
		} else if (configQuiz.currentQuestion === 2) {
			numberCorrectAnswer = configQuiz.questions.quiz_1[2].answer;
		} else if (configQuiz.currentQuestion === 3) {
			numberCorrectAnswer = configQuiz.questions.quiz_1[3].answer;
		}
	} else if (configQuiz.quizGame === 2) {
		if (configQuiz.currentQuestion === 1) {
			numberCorrectAnswer = configQuiz.questions.quiz_2[1].answer;
		} else if (configQuiz.currentQuestion === 2) {
			numberCorrectAnswer = configQuiz.questions.quiz_2[2].answer;
		} else if (configQuiz.currentQuestion === 3) {
			numberCorrectAnswer = configQuiz.questions.quiz_2[3].answer;
		}
	}
	dataItems[numberCorrectAnswer - 1].classList.add('_anim');

	setTimeout(() => {
		dataItems[numberCorrectAnswer - 1].classList.remove('_anim');
	}, 1000);

}

function startGame(item: HTMLElement) {
	gameItems?.classList.add('_hold');
	quizButton?.classList.add('_hold');

	setTimeout(() => {
		drawCurrentProgress();
		checkCollision(item);
	}, 1000);

	setTimeout(() => {
		checkContinueGame();
		configQuiz.playerSelect = 0;
	}, 2000);
}

function checkCollision(item: HTMLElement) {
	if (configQuiz.quizGame === 1) {
		if (configQuiz.currentQuestion === 1) {
			if (configQuiz.questions.quiz_1[1].answer === configQuiz.playerSelect) {
				addMoney(configQuiz.upBankCount, '.score', 500, 1500);
				findAndChangeUserData();
				addCorrectClassName(item);
			} else {
				addUnCorrectClassName(item);
			}
		} else if (configQuiz.currentQuestion === 2) {
			if (configQuiz.questions.quiz_1[2].answer === configQuiz.playerSelect) {
				addMoney(configQuiz.upBankCount, '.score', 500, 1500);
				findAndChangeUserData();
				addCorrectClassName(item);
			} else {
				addUnCorrectClassName(item);
			}
		} else if (configQuiz.currentQuestion === 3) {
			if (configQuiz.questions.quiz_1[3].answer === configQuiz.playerSelect) {
				addMoney(configQuiz.upBankCount, '.score', 500, 1500);
				findAndChangeUserData();
				addCorrectClassName(item);
			} else {
				addUnCorrectClassName(item);
			}
		}
	}
	else if (configQuiz.quizGame === 2) {
		if (configQuiz.currentQuestion === 1) {
			if (configQuiz.questions.quiz_2[1].answer === configQuiz.playerSelect) {
				addMoney(configQuiz.upBankCount, '.score', 500, 1500);
				findAndChangeUserData();
				addCorrectClassName(item);
			} else {
				addUnCorrectClassName(item);
			}
		} else if (configQuiz.currentQuestion === 2) {
			if (configQuiz.questions.quiz_2[2].answer === configQuiz.playerSelect) {
				addMoney(configQuiz.upBankCount, '.score', 500, 1500);
				findAndChangeUserData();
				addCorrectClassName(item);
			} else {
				addUnCorrectClassName(item);
			}
		} else if (configQuiz.currentQuestion === 3) {
			if (configQuiz.questions.quiz_2[3].answer === configQuiz.playerSelect) {
				addMoney(configQuiz.upBankCount, '.score', 500, 1500);
				findAndChangeUserData();
				addCorrectClassName(item);
			} else {
				addUnCorrectClassName(item);
			}
		}
	}

}
function findAndChangeUserData() {
	const idxUserData = bestScores.findIndex(item => item.name === 'User');
	bestScores[idxUserData].points += configQuiz.upBankCount;
}

function addCorrectClassName(item: HTMLElement) {
	item.classList.remove('_target');
	item.classList.add('_correct');
}
function addUnCorrectClassName(item: HTMLElement) {
	item.classList.remove('_target');
	item.classList.add('_uncorrect');
}

function checkContinueGame() {
	if (configQuiz.currentQuestion < configQuiz.maxQuestions) { // Если все вопросы еще не закончились
		// Увеличиваем метку текущего вопроса
		configQuiz.currentQuestion++;

		// Скрываем вопрос и варианты ответов на 0,5 секунды для бесшовной записи следующего вопроса
		setTimeout(() => {
			goNextQuestion();
		}, 500);

		// Записываем следующий вопрос и варианты ответов, обновляем индикатор текущего вопроса
		setTimeout(() => {
			writeQuestion();
			writeCurrentNumberQuestion();
		}, 750);

	} else {
		setTimeout(() => {
			wrapper?.setAttribute('class', 'wrapper');
		}, 150);
		resetGame();
	}

	setTimeout(() => {
		checkRemoveClass('[data-quiz-item]', '_target');
		checkRemoveClass('[data-quiz-item]', '_correct');
		checkRemoveClass('[data-quiz-item]', '_uncorrect');
	}, 750);


}

export function resetGame() {

	configQuiz.currentQuestion = 1;
	updateBestScoresTable(bestScores);

	setTimeout(() => {
		gameItems?.classList.remove('_hold');
		quizButton?.classList.remove('_hold');

		headerQuestion.childNodes.forEach(child => child.remove());
		progressBarInner.setAttribute('class', 'progress-bar__inner');
	}, 1000);

}

function goNextQuestion() {
	quizBody?.classList.add('_hide');

	setTimeout(() => {
		quizBody?.classList.remove('_hide');
		gameItems?.classList.remove('_hold');
		quizButton?.classList.remove('_hold');
	}, 1000);
}

export function writeQuestion() {
	if (configQuiz.quizGame === 1) {
		const child = headerQuestion.querySelector('.quiz__image');

		if (!child) {
			const image = document.createElement('div');
			image.setAttribute('class', 'quiz__image');

			const img = document.createElement('img');
			img.setAttribute('src', configQuiz.questions.quiz_1[1].image);
			image.append(img);

			headerQuestion.append(image);
		}

		const quizImage = document.querySelector('.quiz__image img');

		if (!quizImage) return;

		if (configQuiz.currentQuestion === 1) {
			quizImage.setAttribute('src', configQuiz.questions.quiz_1[1].image);

			dataItems.forEach((item, idx) => {
				const el = item.querySelector('span');
				if (el) el.textContent = configQuiz.questions.quiz_1[1].variants[idx];
			})

		} else if (configQuiz.currentQuestion === 2) {
			quizImage.setAttribute('src', configQuiz.questions.quiz_1[2].image);

			dataItems.forEach((item, idx) => {
				const el = item.querySelector('span');
				if (el) el.textContent = configQuiz.questions.quiz_1[2].variants[idx];
			})
		} else if (configQuiz.currentQuestion === 3) {
			quizImage.setAttribute('src', configQuiz.questions.quiz_1[3].image);

			dataItems.forEach((item, idx) => {
				const el = item.querySelector('span');
				if (el) el.textContent = configQuiz.questions.quiz_1[3].variants[idx];
			})
		}
	}

	else if (configQuiz.quizGame === 2) {
		const child = headerQuestion.querySelector('.quiz__text');
		if (!child) {
			const text = document.createElement('div');
			text.classList.add('quiz__text');
			headerQuestion.append(text);
		}

		const quizTextQuestion = document.querySelector('.quiz__text');

		if (!quizTextQuestion) return;

		if (configQuiz.currentQuestion === 1) {
			quizTextQuestion.textContent = configQuiz.questions.quiz_2[1].text;
			dataItems.forEach((item, idx) => {
				const el = item.querySelector('span');
				if (el) el.textContent = configQuiz.questions.quiz_2[1].variants[idx];
			})
		} else if (configQuiz.currentQuestion === 2) {
			quizTextQuestion.textContent = configQuiz.questions.quiz_2[2].text;
			dataItems.forEach((item, idx) => {
				const el = item.querySelector('span');
				if (el) el.textContent = configQuiz.questions.quiz_2[2].variants[idx];
			})
		} else if (configQuiz.currentQuestion === 3) {
			quizTextQuestion.textContent = configQuiz.questions.quiz_2[3].text;
			quizTextQuestion.classList.add('_small-txt');
			dataItems.forEach((item, idx) => {
				const el = item.querySelector('span');
				if (el) el.textContent = configQuiz.questions.quiz_2[3].variants[idx];
			})
		}
	}
}

function writeCurrentNumberQuestion() {
	quizNumberQuestion.textContent = configQuiz.currentQuestion.toString();
}

function drawCurrentProgress() {
	if (configQuiz.currentQuestion === 1) progressBarInner.setAttribute('class', 'progress-bar__inner _1');
	else if (configQuiz.currentQuestion === 2) progressBarInner.setAttribute('class', 'progress-bar__inner _2');
	else if (configQuiz.currentQuestion === 3) progressBarInner.setAttribute('class', 'progress-bar__inner _3');

}


document.addEventListener('click', (e) => {

	const targetElement = e.target as HTMLElement;

	const money = Number(localStorage.getItem('money'));

	if (targetElement.closest('[data-button="quiz-1"]')) {
		configQuiz.quizGame = 1;
		drawStatusClue();
		writeQuestion();
		setTimeout(() => {
			wrapper?.classList.add('_quiz');
		}, 250);
	}
	if (targetElement.closest('[data-button="quiz-2"]')) {
		configQuiz.quizGame = 2;
		drawStatusClue();
		writeQuestion();
		setTimeout(() => {
			wrapper?.classList.add('_quiz');
		}, 250);
	}

	if (targetElement.closest('[data-button="quiz-home"]')) {
		wrapper?.setAttribute('class', 'wrapper');
		resetGame();
	}

	if (targetElement.closest('[data-quiz-item]') && !targetElement.closest('[data-quiz-item]')?.classList.contains('_target')) {
		const el = targetElement.closest('[data-quiz-item]') as HTMLElement;
		if (el) {
			checkRemoveAddClass('[data-quiz-item]', '_target', el);
			configQuiz.playerSelect = Number(el.getAttribute('data-quiz-item'));
		}
	}

	if (targetElement.closest('[data-button="quiz-continue"]') && configQuiz.playerSelect > 0) {
		const el = document.querySelectorAll('[data-quiz-item]')[configQuiz.playerSelect - 1] as HTMLElement;
		startGame(el);
	}

	if (targetElement.closest('[data-button="quiz-clue"]')) {
		useClueQuiz();
	}

	if (targetElement.closest('[data-button="clue"]')) {
		if (money >= 50) {
			deleteMoney(50, '.score');
			configQuiz.isClueActive = true;
			targetElement.closest('[data-button="clue"]')?.classList.add('_hold');
		} else {
			noMoney('.score');
		}
	}

})