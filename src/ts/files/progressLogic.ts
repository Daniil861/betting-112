const textLevel = document.querySelectorAll('[data-level-text]');
const levelInner = document.querySelectorAll('[data-level-inner]');
const card_2 = document.querySelector('[data-card="2"]');
const card_3 = document.querySelector('[data-card="3"]');

export function upProgress() {
	const progress = Number(localStorage.getItem('progress'));
	const level = Number(localStorage.getItem('level'));
	if (progress < 9) {
		localStorage.setItem('progress', (progress + 2).toString());
	} else {
		localStorage.setItem('progress', '0');
		localStorage.setItem('level', (level + 1).toString());
	}
}

export function writeProgress() {
	const progress = Number(localStorage.getItem('progress'));
	const level = Number(localStorage.getItem('level'));
	const percent = (progress / 10) * 100;

	textLevel.forEach(levelText => {
		if (Number(levelText.getAttribute('data-levelText')) === 0) levelText.textContent = `Level ${level}`;
	});

	levelInner.forEach(i => {
		const inner = i as HTMLElement;
		const data = Number(inner.getAttribute('data-levelInner'));

		if (data === 0) {
			inner.style.width = `${percent}%`;
		}

		if (data === 3 && level >= 3) {
			inner.style.width = `${percent}%`;
			checkAndUnlockItems(level);
		}

		if (data === 10 && level >= 10) {
			inner.style.width = `${percent}%`;
			checkAndUnlockItems(level);
		}
	})
}
function checkAndUnlockItems(level: number) {
	if (level > 3 && card_2?.classList.contains('_disabled')) card_2.classList.remove('_disabled');
	if (level > 10 && card_3?.classList.contains('_disabled')) card_3.classList.remove('_disabled');
}