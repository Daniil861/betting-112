// Проект в котором реализовано - gambling-267
// Данную логику ранее писал в event, но наверно можно и импортировать от сюда
// Также нужно использовать отмену выделения текста в кнопках при длительном косании экрана. Логика лежит здесь - disabledContextMenu.ts

const buttonFlyUp = document.querySelector('[data-button="fly-up"]') as HTMLElement;
const buttonFlyDown = document.querySelector('[data-button="fly-down"]') as HTMLElement;

// Конфиг добавил для примера связывания. В игровом проекте конфиг будет в файле с игрой, для этой логики нужны настройки юзера.
// В файле с игрой - есть функция requestAnimationFrame, в которой вызывается функция moveWhenHold. Она проверяет зажата ли кнопка вниз или
// вверх - если зажата изменяет координату игрока. Так же в функции анимации есть простая функция которая записывает текущее положение игрока.

export const configFlyGame = {
	yOffset: 0,
	vy: 1,
	user: {
		width: 86,
		height: 60,
		isUpTouchHold: false,
		isDownTouchHold: false,
		constHealth: 100,
		health: 100,
	}
}

if (buttonFlyUp) {
	buttonFlyUp.addEventListener('touchstart', (e) => {
		configFlyGame.user.isUpTouchHold = true;
	})
	buttonFlyUp.addEventListener('touchend', (e) => {
		configFlyGame.user.isUpTouchHold = false;
	})
}

if (buttonFlyDown) {
	buttonFlyDown.addEventListener('touchstart', (e) => {
		configFlyGame.user.isDownTouchHold = true;
	})
	buttonFlyDown.addEventListener('touchend', (e) => {
		configFlyGame.user.isDownTouchHold = false;
	})

}

function moveWhenHold() {
	if (configFlyGame.user.isUpTouchHold && configFlyGame.yOffset > 0) {
		configFlyGame.yOffset -= configFlyGame.vy;
	}
	if (configFlyGame.user.isDownTouchHold && configFlyGame.yOffset < window.innerHeight - configFlyGame.user.height - 20) {
		configFlyGame.yOffset += configFlyGame.vy;
	}
}


export { };
