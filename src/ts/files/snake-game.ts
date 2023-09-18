import { getRandom, checkCollision, addMoney } from "./functions";


interface IConfigWormGame {
	state: number;
	lastTime: number;
	wormGame: WormGame | null;
	fruits: number[];
	pricesFruits: IPricesFruit
}

interface IPricesFruit {
	1: number;
	2: number;
	3: number;
}

export const configWormGame: IConfigWormGame = {
	state: 1, // 1 - not play, 2 - game resume

	lastTime: 0,

	fruits: [4, 12, 25],

	pricesFruits: {
		1: 50,
		2: 100,
		3: 200
	},
	wormGame: null
}

class WormBase {
	x = 0;
	y = 0;
	rotate = 0;

	width = 34;
	height = 34;

	lastX = 0;
	lastY = 0;
	lastRotate = 0;

	coeffOffsetBetwinLinks = 0.2; // расстояние между звеньями змеи - коефф * ширина звена

	updateLastPosition() {
		this.lastX = this.x;
		this.lastY = this.y;
		this.lastRotate = this.rotate;
	}
}

class Worm extends WormBase {

	startCountWormLinks = 5;

	startZIndex = 100;
	wormLinks: WormLink[] = [];

	field = document.querySelector('.field__body') as HTMLElement;

	worm?: HTMLElement;
	head?: HTMLElement;

	constructor(public color: string) {
		super();

		this.createWorm();
		this.calculateStartPositionHead();
		this.drawCurrentPositionWormHead();
	}

	// Создаем и записываем голову
	createWorm() {
		this.worm = document.createElement('div');
		this.worm.setAttribute('class', 'field__worm worm');
		this.worm.setAttribute('data-color', this.color);

		const wormBody = document.createElement('div');
		wormBody.classList.add('worm__body')

		this.head = document.createElement('div');
		this.head.classList.add('worm__head');
		this.head.style.zIndex = this.startZIndex.toString();

		const mouth = document.createElement('div');
		mouth.classList.add('worm__mouth');

		const eye = document.createElement('div');
		eye.classList.add('worm__eyes');

		this.head.append(eye, mouth);

		wormBody.append(this.head);
		this.worm.append(wormBody);

		this.field.append(this.worm);
	}
	calculateStartPositionHead() {
		const width = window.innerWidth;
		const height = this.field.getBoundingClientRect().height;

		this.x = (width * 0.5) - (this.width * 0.5);
		this.y = (height * 0.5) - (this.height * 0.5);
	}
	drawCurrentPositionWormHead() {
		if (!this.head) return;
		this.head.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotate}deg)`;
	}

	// Создаем и записываем остальные стартовые части
	createStartWormLinks() {
		this.addFirstWormLink();

		for (let i = 0; i < this.startCountWormLinks - 1; i++) {
			this.addNewWormLink();
		}
	}
	addFirstWormLink() {

		const x = this.x - this.width * this.coeffOffsetBetwinLinks;
		const y = this.y;
		--this.startZIndex;

		this.wormLinks.push(new WormLink(x, y, this.rotate, this.startZIndex));
	}
	addNewWormLink() {
		const lastWormLink = this.wormLinks[this.wormLinks.length - 1];

		const x = lastWormLink.x - lastWormLink.width * this.coeffOffsetBetwinLinks;
		const y = lastWormLink.y;
		--this.startZIndex;

		this.wormLinks.push(new WormLink(x, y, lastWormLink.rotate, this.startZIndex));
	}
	//===========

	// Обновление последней позиции частей
	updateLastPositionsWormLinks() {
		const firstWormLink = this.wormLinks[0];

		// Перезаписываем предыдущую позицию первого звена червя
		firstWormLink.updateLastPosition();

		for (let i = 1; i < this.wormLinks.length; i++) {
			this.wormLinks[i].updateLastPosition();
		}
	}

	// Запись новых позиций частей
	updateCurrentPositionWormLinks() {
		const firstWormLink = this.wormLinks[0];
		// Обновляем позицию первого звена - указываем предыдущую позицию головы
		firstWormLink.drawNewPositionData(this);

		for (let i = 1; i < this.wormLinks.length; i++) {
			const currentItem = this.wormLinks[i];
			const previusItem = this.wormLinks[i - 1];
			currentItem.drawNewPositionData(previusItem);
		}
	}

	// Обновление положения частей на экране
	drawCurrentPositionLinksWorm() {
		this.wormLinks.forEach(wormLink => wormLink.drawCurrentPositionWormLink());
	}

	setCurrentColor() {
		this.worm?.setAttribute('data-color', this.color);
	}

	resetLinks() {
		this.wormLinks.splice(0);
		const wormLinks = document.querySelectorAll('.worm__link');
		for (let i = 0; i < wormLinks.length; i++) {
			wormLinks[i].remove();
		}
	}
}

class WormLink extends WormBase {

	wormLink?: HTMLElement;
	wormBody = document.querySelector('.worm__body') as HTMLElement;

	constructor(public x: number, public y: number, public rotate: number, public zIndex: number) {
		super();

		this.createWormLink();
		this.drawCurrentPositionWormLink();
	}

	createWormLink() {
		this.wormLink = document.createElement('div');
		this.wormLink.classList.add('worm__link');
		this.wormLink.style.zIndex = this.zIndex.toString();

		this.wormBody.append(this.wormLink);
	}

	drawCurrentPositionWormLink() {
		if (!this.wormLink) return;
		this.wormLink.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotate}deg)`;
	}

	drawNewPositionData(item: WormLink | Worm) {
		this.x = item.lastX;
		this.y = item.lastY;
		this.rotate = item.lastRotate;
	}
}


class WormGame {

	level = 1;

	currentDirection = 'right';

	targetCoins = document.querySelector('.snake-game__header .target-box__count') as HTMLElement;
	levelItem = document.querySelector('[data-level] span') as HTMLElement;

	// time
	currentTime = 0;
	timeLimit = 25; // speed snake

	worm?: Worm;

	create() {
		this.createWorm();
	}

	createWorm() {
		this.worm = new Worm('blue');
	}

	createFruits() {
		const length = configWormGame.fruits[this.level - 1];

		for (let i = 0; i < length; i++) {
			// Генерируем случайный фрукт.
			let number = 1;
			if (this.level > 1) number = getRandom(1, this.level + 1);

			// Создаем фрукт
			const fruit = document.createElement('div');
			fruit.classList.add('field__fruit');
			// Дата атрибут, для разных фруктов разное вознаграждение
			fruit.setAttribute('data-fruit', number.toString());

			// Создаем картинку фрукта
			const image = document.createElement('img');
			image.setAttribute('src', `img/game/fruit-${number}.png`);

			// Добавляем картинку в контейнер фрукта
			fruit.append(image);

			const x = getRandom(50, window.innerWidth - 50);

			const y = getRandom(70, window.innerHeight - 50);

			const rotate = getRandom(0, 360);

			fruit.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;

			// Добавляем контейнер фрукта на поле
			document.querySelector('.field__body')?.append(fruit);
		}
	}

	checkCollision() {
		const fruits = document.querySelectorAll('.field__fruit');

		for (let i = 0; i < fruits.length; i++) {
			const dataFruit = fruits[i].getBoundingClientRect();
			if (this.worm && checkCollision(dataFruit, this.worm)) {
				const fruit = Number(fruits[i].getAttribute('data-fruit'));
				if (fruit) this.updateCoins(fruit);
				this.worm.addNewWormLink();

				fruits[i].remove();
				break;
			}
		}
	}

	checkEndedLevel() {
		const fruits = document.querySelectorAll('.field__fruit');

		if (fruits.length <= 0) {
			this.levelUp();
		}
	}

	levelUp() {
		document.querySelector('.field__body')?.classList.add('_level-up');
		stopGame();

		if (this.level < 3) this.level++;

		if (this.level === 2 && this.worm) this.worm.color = 'purple';
		else if (this.level === 3 && this.worm) this.worm.color = 'yellow';

		setTimeout(() => {
			this.worm?.setCurrentColor();
			resetDataWorm();
			this.createFruits();
			this.levelItem.textContent = this.level.toString();
			this.worm?.createStartWormLinks();
		}, 500);

		setTimeout(() => {
			document.querySelector('.field__body')?.classList.remove('_level-up');

			startGame();
		}, 1000);
	}

	resetLevel() {
		this.level = 1;
		this.levelItem.textContent = this.level.toString();
	}

	updateCoins(fruit: number) {
		if (fruit === 1) {
			this.targetCoins.textContent = configWormGame.pricesFruits[1].toString();
			addMoney(configWormGame.pricesFruits[1], '.score', 500, 1500);
		} else if (fruit === 2) {
			this.targetCoins.textContent = configWormGame.pricesFruits[2].toString();
			addMoney(configWormGame.pricesFruits[2], '.score', 500, 1500);
		} else if (fruit === 3) {
			this.targetCoins.textContent = configWormGame.pricesFruits[3].toString();
			addMoney(configWormGame.pricesFruits[3], '.score', 500, 1500);
		}
	}

	update(deltatime: number) {
		if (this.currentTime >= this.timeLimit && this.worm) {
			this.currentTime = 0;
			const linkOffset = this.worm.coeffOffsetBetwinLinks;

			//==========================================================================================
			// блок обновления старых позиций
			// Обновляем старые позиции - до дальнейшего изменения позиции головы last и current позиции равны
			// Здесь позиции головы и частей не связаны
			this.worm.updateLastPosition();
			this.worm.updateLastPositionsWormLinks();
			//=============

			//==========================================================================================
			// Блок обновления позиции головы
			if (this.worm.x >= window.innerWidth && this.currentDirection === 'right') this.worm.x = -this.worm.width * linkOffset;
			if (this.worm.x + this.worm.width <= 0 && this.currentDirection === 'left') this.worm.x = window.innerWidth + this.worm.width * linkOffset;
			if (this.worm.y >= window.innerHeight && this.currentDirection === 'down') this.worm.y = -this.worm.height * linkOffset;
			if (this.worm.y + this.worm.width < 0 && this.currentDirection === 'up') this.worm.y = window.innerHeight + this.worm.height * linkOffset;

			if (this.currentDirection === 'right') {
				this.worm.x += this.worm.width * linkOffset;
			} else if (this.currentDirection === 'left') {
				this.worm.x -= this.worm.width * linkOffset;
			} else if (this.currentDirection === 'up') {
				this.worm.y -= this.worm.height * linkOffset;
			} else if (this.currentDirection === 'down') {
				this.worm.y += this.worm.height * linkOffset;
			}
			//============

			//==========================================================================================
			// блок обновления позиций частей червяка, после обновления позиции головы
			this.worm.updateCurrentPositionWormLinks();
			//===========

			//==========================================================================================
			// блок записи новых позиций элементам на экране
			this.worm.drawCurrentPositionWormHead();
			this.worm.drawCurrentPositionLinksWorm();
			//==========

			this.checkCollision();
			this.checkEndedLevel();

		} else {
			this.currentTime += deltatime;
		}

	}
}

// Инициализируем игру
if (document.querySelector('.snake-game')) {
	initGame();
}

function initGame() {
	configWormGame.wormGame = new WormGame();
	configWormGame.wormGame.create();
}

export function startGame() {
	configWormGame.state = 2;
	animateWormGame(0);
}

export function stopGame() {
	configWormGame.state = 1;
}

function resetDataWorm() {
	if (configWormGame.wormGame && configWormGame.wormGame.worm) {
		configWormGame.wormGame.currentDirection = 'right';

		configWormGame.wormGame.worm.calculateStartPositionHead();
		configWormGame.wormGame.worm.drawCurrentPositionWormHead();
		configWormGame.wormGame.worm.rotate = 0;

		configWormGame.wormGame.worm.updateCurrentPositionWormLinks();
		configWormGame.wormGame.worm.drawCurrentPositionLinksWorm();
		configWormGame.wormGame.worm.resetLinks();
		configWormGame.wormGame.worm.startZIndex = 100;
	}
}

export function resetGame() {
	if (configWormGame.wormGame && configWormGame.wormGame.worm) {
		configWormGame.wormGame.resetLevel();

		configWormGame.wormGame.worm.color = 'blue';
		configWormGame.wormGame.worm.setCurrentColor();
	}
	resetDataWorm();

	const fruits = document.querySelectorAll('.field__fruit');
	fruits.forEach(fruit => fruit.remove());

	configWormGame.lastTime = 0;
}


function animateWormGame(timestamp: number) {
	const deltatime = timestamp - configWormGame.lastTime;
	configWormGame.lastTime = timestamp;

	configWormGame.wormGame?.update(deltatime);

	if (configWormGame.state === 2) requestAnimationFrame(animateWormGame);
}


const wormHead = document.querySelector('.worm__head');

// Объявляем слушатель событий "клик"
document.addEventListener('click', (e) => {

	const wrapper = document.querySelector('.wrapper');

	const targetElement = e.target as HTMLElement;

	if (targetElement.closest('[data-button="game"') && configWormGame.wormGame && configWormGame.wormGame.worm) {
		wrapper?.classList.add('_game');
		configWormGame.wormGame.createFruits();
		configWormGame.wormGame.worm.createStartWormLinks();
		setTimeout(() => {
			startGame();
		}, 250);
	}

	if (targetElement.closest('[data-button="game-home"')) {
		wrapper?.setAttribute('class', 'wrapper');
		stopGame();
		setTimeout(() => {
			resetGame();
		}, 600);
	}

	if (targetElement.closest('.field__body') && configWormGame.state === 2) {
		const xTouch = e.x;
		const yTouch = e.y;

		if (wormHead && configWormGame.wormGame && configWormGame.wormGame.worm) {
			const xHead = wormHead.getBoundingClientRect().x;
			const yHead = wormHead.getBoundingClientRect().y;

			// если кликнули левее головы и нужно проверить что y головы выше y хвоста минимум на размер одного звена
			if (configWormGame.wormGame.currentDirection === 'up' || configWormGame.wormGame.currentDirection === 'down') {
				if (xTouch < xHead) {
					configWormGame.wormGame.currentDirection = 'left';
					configWormGame.wormGame.worm.rotate = 180;
				} else if (xTouch > xHead) {
					configWormGame.wormGame.currentDirection = 'right';
					configWormGame.wormGame.worm.rotate = 0;
				}
			} else if (configWormGame.wormGame.currentDirection === 'left' || configWormGame.wormGame.currentDirection === 'right') {
				if (yTouch < yHead) {
					// меняем направление на вверх
					configWormGame.wormGame.currentDirection = 'up';
					configWormGame.wormGame.worm.rotate = 270;
				} else if (yTouch > yHead) {
					// меняем направление на вверх
					configWormGame.wormGame.currentDirection = 'down';
					configWormGame.wormGame.worm.rotate = 90;
				}
			}
		}
	}
})
