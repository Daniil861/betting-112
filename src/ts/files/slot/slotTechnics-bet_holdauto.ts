// Кнопка spin, удерживая которую запускаем автоспин

//=============
interface IConfigSlot {
	currentWin: number;
	winCoeff_1: number;
	winCoeff_2: number;
	winCoeff_3: number;

	rows_slot1: number;
	rows_slot2: number;
	rows_slot3: number;

	minBet: number;
	maxBet: number;

	betSlot1: number;

	isAutMode: boolean;
	isWin: boolean;

	timer: null | NodeJS.Timeout;
	symbols: string[]
}

interface IConfig {
	inverted: boolean;
	onSpinStart: (symbols?: string[][]) => void;
	onSpinEnd: (
		symbols?: string[][],
		spinButton?: HTMLElement,
		autoSpinButton?: HTMLElement
	) => void;

}
//==============

let tl = gsap.timeline({ defaults: { ease: "Power1.easeInOut", duration: 1.5 } });


export const configSlot: IConfigSlot = {
	currentWin: 0,
	winCoeff_1: 30,
	winCoeff_2: 30,
	winCoeff_3: 30,

	rows_slot1: 3, // количество рядов с картинками (как правило всегда 3)
	rows_slot2: 3,
	rows_slot3: 3,

	minBet: 50,
	maxBet: 950,

	betSlot1: 50,

	isAutMode: false,
	isWin: false,

	timer: null,
	symbols: [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
	]
}

const configGSAP = {
	duration_1: 1,
	duration_3: 3
}

const slotElement1 = document.getElementById("slot1");


//========================================================================================================================================================
let slot1: Slot1 | null = null;

class Slot1 {
	currentSymbols: string[][];
	nextSymbols: string[][];
	container: HTMLElement;
	reels: Reel1[];
	spinButton: HTMLElement;
	casinoAutoSpinCount = 0;
	config: IConfig;
	holder: null | NodeJS.Timeout;

	constructor(domElement: HTMLElement, config: IConfig) {
		Symbol1.preload();

		this.currentSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["7", "8", "1"]
		];

		this.nextSymbols = [
			["1", "2", "3"],
			["4", "5", "6"],
			["7", "8", "1"]
		];

		this.container = domElement;

		this.reels = Array.from(this.container.getElementsByClassName("reel1")).map(
			(reelContainer: Element, idx: number) => {
				return new Reel1(reelContainer, idx, this.currentSymbols[idx])
			}
		);
		this.spinButton = document.querySelector('[data-button="spin-1"]') as HTMLElement;
		this.spinButton.addEventListener("click", () => {
			//при запуске сбрасываем интервал запуска между слотами
			tl.to(this.spinButton, {});

			if ((Number(localStorage.getItem('money')) >= Number(localStorage.getItem('current-bet')))) {
				this.spin();

			} else {
				// noMoney('.score');
			}
		});

		this.holder = null;
		this.spinButton = document.querySelector('[data-button="spin-1"]') as HTMLElement;

		this.spinButton.addEventListener("touchstart", () => {
			let oThis = this;
			this.holder = setTimeout(function () {
				configSlot.isAutMode = true;
				oThis.autoSpin();
			}, 2000)
		});

		this.spinButton.addEventListener("touchend", () => {

			this.holder && clearTimeout(this.holder);
			if (!configSlot.isAutMode) {
				tl.to(this.spinButton, {});
				if ((Number(localStorage.getItem('money')) >= Number(localStorage.getItem('current-bet')))) {
					this.spin();
				} else {
					// noMoney('.score');
				}
			}
		});

		if (config.inverted) {
			this.container.classList.add("inverted");
		}
		this.config = config;
	}

	autoSpin() {
		var oThis = this;
		this.casinoAutoSpinCount = 0;
		if (Number(localStorage.getItem('money')) > Number(localStorage.getItem('current-bet'))) {
			this.casinoAutoSpinCount++;
			this.spin();
		}
		configSlot.timer = setInterval(function () {
			oThis.casinoAutoSpinCount++;
			if (oThis.casinoAutoSpinCount >= 9) configSlot.isAutMode = false;

			tl.to(oThis.spinButton, {});

			if (oThis.casinoAutoSpinCount < 10 && (Number(localStorage.getItem('money')) >= Number(localStorage.getItem('current-bet')))) {
				oThis.spin();
			} else if (configSlot.timer && oThis.casinoAutoSpinCount >= 10 && (Number(localStorage.getItem('money')) >= Number(localStorage.getItem('current-bet')))) {
				clearInterval(configSlot.timer);
			} else if (configSlot.timer && (Number(localStorage.getItem('money')) < Number(localStorage.getItem('current-bet')))) {
				clearInterval(configSlot.timer);
				// noMoney('.score');
			}
		}, 5500);
	}

	async spin() {
		this.currentSymbols = this.nextSymbols;
		this.nextSymbols = [
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
			[Symbol1.random(), Symbol1.random(), Symbol1.random()],
			[Symbol1.random(), Symbol1.random(), Symbol1.random()]
		];

		this.onSpinStart(this.nextSymbols);

		await Promise.all(
			this.reels.map((reel) => {
				reel.renderSymbols(this.nextSymbols[reel.idx]);
				return reel.spin(this.nextSymbols);
			})
		);
	}

	onSpinStart(symbols: string[][]) {
		// deleteMoney(Number(localStorage.getItem('current-bet')), '.score');

		this.spinButton.classList.add('_hold');

		if (symbols) {
			this.config.onSpinStart(symbols);
		}
	}

	onSpinEnd(symbols: string[][]) {
		if (!configSlot.isAutMode) {
			this.spinButton.classList.remove('_hold');
		}

		if (symbols) {
			this.config.onSpinEnd(symbols);
		}
	}
}

class Reel1 {
	symbolContainer: HTMLDivElement;
	param?: number;

	constructor(public reelContainer: Element, public idx: number, initialSymbols: string[]) {

		this.symbolContainer = document.createElement("div");
		this.symbolContainer.classList.add("icons");
		this.reelContainer.appendChild(this.symbolContainer);

		initialSymbols.forEach((symbol) => {
			const newImage = new Symbol1(symbol).img;
			if (newImage) this.symbolContainer.appendChild(newImage)
		});
	}

	get factor() {
		return configSlot.rows_slot1 + Math.pow(this.idx / 2, 2);
	}

	renderSymbols(nextSymbols: string[]) {
		const fragment = document.createDocumentFragment();

		for (let i = configSlot.rows_slot1; i < configSlot.rows_slot1 + Math.floor(this.factor) * 10; i++) {
			const icon = new Symbol1(
				i >= 10 * Math.floor(this.factor) - 2
					? nextSymbols[i - Math.floor(this.factor) * 10]
					: undefined
			);
			if (icon.img) fragment.appendChild(icon.img);
		}

		this.symbolContainer.appendChild(fragment);
	}

	async spin(symbols: string[][]) {
		// запускаем анимацию смещения колонки
		this.param = ((Math.floor(this.factor) * 10) / (configSlot.rows_slot1 + Math.floor(this.factor) * 10)) * 100;

		await tl.fromTo(this.symbolContainer, { translateY: 0, }, {
			translateY: `${-this.param}%`,
			duration: configGSAP.duration_3,
			onComplete: () => {

				// определяем какое количество картинок хотим оставить в колонке
				const max = this.symbolContainer.children.length - configSlot.rows_slot1; // 3 - количество картинок в одной колонке после остановки

				gsap.to(this.symbolContainer, { translateY: 0, duration: 0 });

				// запускаем цикл, в котором оставляем определенное количество картинок в конце колонки
				for (let i = 0; i < max; i++) {
					this.symbolContainer.firstChild?.remove();
				}
			}
		}, '<10%');

		// После выполнения анимации запускаем сценарий разблокировки кнопок и проверки результата
		slot1?.onSpinEnd(symbols);
	}
}

let cache1: HTMLImageElement[];

class Symbol1 {

	img?: HTMLImageElement;

	constructor(public name: string = Symbol1.random()) {

		if (cache1[Number(name)]) {
			this.img = cache1[Number(name)].cloneNode() as HTMLImageElement;
		} else {
			this.img = document.createElement('img');
			this.img.src = `img/slot/slot-${name}.png`;

			cache1[Number(name)] = this.img;
		}
	}

	static preload() {
		Symbol1.symbols.forEach((symbol) => new Symbol1(symbol));
	}

	static get symbols() {
		return configSlot.symbols;
	}

	static random() {
		return this.symbols[Math.floor(Math.random() * this.symbols.length)];
	}
}

const config1: IConfig = {
	inverted: false,
	onSpinStart: (symbols) => { },
	onSpinEnd: (symbols) => {
		if (symbols) {
			if (symbols[0][0] == symbols[1][0] && symbols[1][0] == symbols[2][0] ||
				symbols[0][1] == symbols[1][1] && symbols[1][1] == symbols[2][1] ||
				symbols[0][2] == symbols[1][2] && symbols[1][2] == symbols[2][2]) {

				if (configSlot.isAutMode && configSlot.timer) {
					clearInterval(configSlot.timer);
					configSlot.isAutMode = false;

					document.querySelector('[data-button="spin-1"]')?.classList.remove('_hold');
				}

				const currintWin = Number(localStorage.getItem('current-bet')) * configSlot.winCoeff_1;

				// addMoney(currintWin, '.score', 1000, 2000);
				// showFinalScreen(currintWin, 'win');
			} else {
				// showFinalScreen(Number(localStorage.getItem('current-bet')));
			}
		}

	},
};

if (document.querySelector('[data-screen="slot-1"]') && slotElement1) {
	slot1 = new Slot1(slotElement1, config1);
}

//========================================================================================================================================================
if (targetElement.closest('[data-button="slot-1-home"]')) {
	const wrapper = document.querySelector('.wrapper');

	wrapper?.classList.add('_slot-screen');
	wrapper?.classList.remove('_slot-1');
	if (configSlot.isAutMode && configSlot.timer) {
		clearInterval(configSlot.timer);
		configSlot.isAutMode = false;

		document.querySelector('[data-button="spin-1"]')?.classList.remove('_hold');
		document.querySelector('[data-button="auto-1"]')?.classList.remove('_hold');
	}
}