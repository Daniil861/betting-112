//================
//  Анимируем загрузку экрана
export function digitsCounterInit(digitsCountersItems: HTMLElement[]) {
	const digitCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll('[data-digits-counter]');
	if (digitCounters) {
		digitCounters.forEach(digitCounter => {
			digitsCountersAnimate(digitCounter as HTMLElement);
		})
	}
}

function digitsCountersAnimate(digitsCounter: HTMLElement) {
	let startTimestamp: null | number = null;

	const digitsCounterVal = digitsCounter.getAttribute('data-digitsCounter');
	let duration: number;
	if (digitsCounterVal) duration = parseInt(digitsCounterVal) ? parseInt(digitsCounterVal) : 1000;

	const startValue = parseInt(digitsCounter.innerHTML);
	const startPosition = 0;
	const innerBar = document.querySelector('.loader__loading-inner') as HTMLElement;

	const step = (timestamp: number) => {
		if (!startTimestamp) startTimestamp = timestamp;
		const progress = Math.min((timestamp - startTimestamp) / duration, 6);

		const percent = `${Math.floor(progress * (startPosition + startValue))}%`;
		digitsCounter.innerHTML = percent;
		if (innerBar) innerBar.style.width = percent;

		if (progress < 1) {
			window.requestAnimationFrame(step);

		} else {
			setTimeout(() => {
				location.href = 'main.html';
			}, 500);

		}
	}
	window.requestAnimationFrame(step);
}