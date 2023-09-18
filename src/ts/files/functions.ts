
/* Проверка мобильного браузера */
export let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

/* Добавление класса touch для HTML если браузер мобильный */
export function addTouchClass() {
	// Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');
}

// Добавление loaded для HTML после полной загрузки страницы
export function addLoadedClass() {
	window.addEventListener("load", function () {
		if (document.querySelector('body')) {
			setTimeout(function () {
				document.querySelector('body')?.classList.add('_loaded');
			}, 200);
		}
	});
}

// Получение хеша в адресе сайта
export function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}

// Указание хеша в адресе сайта
export function setHash(hash: string) {
	hash = hash ? `#${hash}` : window.location.href.split('#')[0];
	history.pushState('', '', hash);
}

// Вспомогательные модули блокировки прокрутки и скочка ====================================================================================================================================================================================================================================================================================
export let bodyLockStatus = true;

export let bodyLockToggle = (delay: number = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}

export let bodyUnlock = (delay: number = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index] as HTMLElement;
				el.style.paddingRight = '0px';
			}
			if (body) body.style.paddingRight = '0px';
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}
export let bodyLock = (delay: number = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {

		let lock_padding = document.querySelectorAll("[data-lp]");

		const wrapper = document.querySelector('.wrapper') as HTMLElement;

		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index] as HTMLElement;
			el.style.paddingRight = window.innerWidth - wrapper.offsetWidth + 'px';
		}

		if (body) body.style.paddingRight = window.innerWidth - wrapper.offsetWidth + 'px';
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}

// Вспомогательные модули плавного расскрытия и закрытия объекта ======================================================================================================================================================================
export let _slideUp = (target: HTMLElement, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = '0';
		target.style.paddingBottom = '0';
		target.style.marginTop = '0';
		target.style.marginBottom = '0';
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showmore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			// Создаем событие 
			document.dispatchEvent(new CustomEvent("slideUpDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
export let _slideDown = (target: HTMLElement, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) target.hidden = false;
		showmore ? target.style.removeProperty('height') : null;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = '0';
		target.style.paddingBottom = '0';
		target.style.marginTop = '0';
		target.style.marginBottom = '0';
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			// Создаем событие 
			document.dispatchEvent(new CustomEvent("slideDownDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
export let _slideToggle = (target: HTMLElement, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

// Модуь работы с табами =======================================================================================================================================================================================================================
/*
Для родителя табов пишем атрибут data-tabs
Для родителя заголовков табов пишем атрибут data-tabs-titles
Для родителя блоков табов пишем атрибут data-tabs-body
Для родителя блоков табов можно указать data-tabs-hash, это втключит добавление хеша

Если нужно чтобы табы открывались с анимацией 
добавляем к data-tabs data-tabs-animate
По умолчанию, скорость анимации 500ms, 
указать свою скорость можно так: data-tabs-animate="1000"

Если нужно чтобы табы превращались в "спойлеры", на неком размере экранов, пишем параметры ширины.
Например: data-tabs="992" - табы будут превращаться в спойлеры на экранах меньше или равно 992px
*/
export function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash: string[] = [];

	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-');
		}
		tabs.forEach((t, index) => {
			const tabsBlock = t as HTMLElement;
			tabsBlock.classList.add('_tab-init');
			tabsBlock.setAttribute('data-tabs-index', index.toString());
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});

		// Получение слойлеров с медиа запросами
		let mdQueriesArray = dataMediaQueries(tabs, "tabs");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие

				if (mdQueriesItem.matchMedia && mdQueriesItem.itemsArray) {
					mdQueriesItem.matchMedia.addEventListener("change", function () {
						if (mdQueriesItem.matchMedia && mdQueriesItem.itemsArray) {
							setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
						};
					});
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				}
			});
		}
	}
	// Установка позиций заголовков
	function setTitlePosition(tabsMediaArray: IBreakpoint[], matchMedia: MediaQueryList) {
		tabsMediaArray.forEach(tabsMediaObject => {
			if (tabsMediaObject.item) {
				const tabsMediaItem = tabsMediaObject.item;
				let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
				let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
				let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
				let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');

				const filteredTabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
				const filteredTabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
				filteredTabsContentItems.forEach((tabsContentItem, index) => {
					if (matchMedia.matches && tabsContent) {
						tabsContent.append(filteredTabsTitleItems[index]);
						tabsContent.append(tabsContentItem);
						tabsMediaItem.classList.add('_tab-spoller');
					} else {
						if (tabsTitles) tabsTitles.append(tabsTitleItems[index]);
						tabsMediaItem.classList.remove('_tab-spoller');
					}
				});
			}

		});
	}
	// Работа с контентом
	function initTabs(tabsBlock: HTMLElement) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
			tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
		}
		if (tabsContent.length) {
			const filteredTabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			const filteredTabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			filteredTabsContent.forEach((t, index) => {
				const tabsContentItem = t as HTMLElement;
				filteredTabsTitles[index].setAttribute('data-tabs-title', '');
				tabsContentItem.setAttribute('data-tabs-item', '');

				if (tabsActiveHashBlock && index.toString() === tabsActiveHash[1]) {
					tabsTitles[index].classList.add('_tab-active');
				}
				tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
			});
		}
	}
	function setTabsStatus(t: Element) {
		const tabsBlock = t as HTMLElement;
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock: HTMLElement) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				const animParam = tabsBlock.dataset.tabsAnimate;
				if (!animParam) return false;
				return Number(animParam) > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute('data-tabs-hash');
			const filteredTabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			// tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			const filteredTabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			// tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			filteredTabsContent.forEach((t, index) => {
				const tabsContentItem = t as HTMLElement;
				if (filteredTabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) {
						_slideDown(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = false;
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`);
					}
				} else {
					if (tabsBlockAnimate) {
						_slideUp(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = true;
					}
				}
			});
		}
	}
	function setTabsAction(e: Event) {
		const el = e.target as HTMLElement;
		if (el.closest('[data-tabs-title]')) {
			const tabTitle = el.closest('[data-tabs-title]') as HTMLElement;
			const tabsBlock = tabTitle.closest('[data-tabs]');

			if (!tabTitle.classList.contains('_tab-active') && tabsBlock && !tabsBlock.querySelector('._slide')) {
				let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');

				if (!tabActiveTitle.length) return;

				let newTabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock);

				tabActiveTitle.length ? newTabActiveTitle[0].classList.remove('_tab-active') : null;
				tabTitle.classList.add('_tab-active');
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}

//================================================================================================================================================================================================================================================================================================================
// Прочие полезные функции ================================================================================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================================================================================
// Обработа медиа запросов из атрибутов 

interface IBreakpoint {
	value: string;
	type: string;
	item: HTMLElement | null;
}

interface IMdQueriesArray {
	itemsArray?: IBreakpoint[],
	matchMedia?: MediaQueryList
}

export function dataMediaQueries(array: NodeListOf<Element>, dataSetValue: string) {
	// Получение объектов с медиа запросами
	const media = Array.from(array).filter(function (i, index, self) {
		const item = i as HTMLElement;
		const data = item.dataset[dataSetValue];
		if (data) {
			return data.split(",")[0];
		}
	});
	// Инициализация объектов с медиа запросами
	if (media.length) {
		const breakpointsArray: IBreakpoint[] = [];
		media.forEach(i => {
			const item = i as HTMLElement;
			const params = item.dataset[dataSetValue];
			const breakpoint: IBreakpoint = {
				value: '',
				type: '',
				item: null
			};
			if (!params) return;
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray: IMdQueriesArray[] = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с нужными условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			});
			return mdQueriesArray;
		}
	}
}

// Уникализация массива
export function uniqArray(array: string[]) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}

// Получить цифры из строки
export function getDigFromString(item: string) {
	return parseInt(item.replace(/[^\d]/g, ''))
}

// Форматирование цифр типа 100 000 000
export function getDigFormat(item: number) {
	const separator = ' ';
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${separator}`);
}

// Убрать класс из всех элементов массива
export function removeClasses(array: Element[], className: string) {
	for (var i = 0; i < array.length; i++) {
		array[i].classList.remove(className);
	}
}

//================================================================================================================================================================================================================================================================================================================
//========================================================================================================================================================
// Функции
export function deleteMoney(count: number, block: string, storrName: string = 'money') {
	const money = localStorage.getItem(storrName);
	const items = document.querySelectorAll(block);
	if (money) {
		const newMoney = +money - count;
		localStorage.setItem(storrName, newMoney.toString());

		const newMoneyCountString = localStorage.getItem(storrName);
		const newMoneyCountNumber = +newMoneyCountString!;
		let moneyNew = getDigFormat(newMoneyCountNumber);

		if (items.length > 0) {
			items.forEach(el => {
				el.classList.add('_delete-money');
				el.textContent = moneyNew;
			});
			setTimeout(() => {
				items.forEach(el => el.classList.remove('_delete-money'));
			}, 1400);
		}
	}

}

export function addRemoveClass(block: string, className: string, delay: number) {
	document.querySelector(block)?.classList.add(className);
	setTimeout(() => {
		document.querySelector(block)?.classList.remove(className);
	}, delay);
}

export function checkRemoveAddClass(block: string, className: string, item: Element) {
	document.querySelectorAll(block).forEach(item => item.classList.remove(className));
	item.classList.add(className);
}

export function checkRemoveClass(block: string, className: string) {
	document.querySelectorAll(block).forEach(item => item.classList.remove(className));
}

export function noMoney(block: string) {
	document.querySelectorAll(block).forEach(el => el.classList.add('_no-money'));
	setTimeout(() => {
		document.querySelectorAll(block).forEach(el => el.classList.remove('_no-money'));
	}, 1400);
}

export function getRandom(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function addMoney(count: number, block: string, delay: number, delayOff: number, storrName: string = 'money') {
	const startMoneyStr = localStorage.getItem('money');

	if (startMoneyStr) {
		const startMoneyNumber = +startMoneyStr;
		const newMoneyNumber = Math.floor(startMoneyNumber + count);
		setTimeout(() => {
			localStorage.setItem('money', newMoneyNumber.toString());
			document.querySelectorAll(block).forEach(el => el.textContent = getDigFormat(newMoneyNumber));
			document.querySelectorAll(block).forEach(el => el.classList.add('_anim-add-money'));
		}, delay);
		setTimeout(() => {
			document.querySelectorAll(block).forEach(el => el.classList.remove('_anim-add-money'));
		}, delayOff);
	}

}

export function addResource(count: number, block: string, delay: number, delayOff: number, storrName: string = 'resource') {
	const startMoneyStr = localStorage.getItem('resource');

	if (startMoneyStr) {
		const startMoneyNumber = +startMoneyStr;
		const newMoneyNumber = Math.floor(startMoneyNumber + count);
		setTimeout(() => {
			localStorage.setItem('resource', newMoneyNumber.toString());
			document.querySelectorAll(block).forEach(el => el.textContent = getDigFormat(newMoneyNumber));
			document.querySelectorAll(block).forEach(el => el.classList.add('_anim-add-money'));
		}, delay);
		setTimeout(() => {
			document.querySelectorAll(block).forEach(el => el.classList.remove('_anim-add-money'));
		}, delayOff);
	}
}


export function translToPercent(all: number, current: number) {
	return (100 * current) / all;
}

export function shuffle(array: number[]) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// ========== Работа с сохранением массива/объекта в памяти браузера
// Сохраняем изначальный массив
export function saveArrStorrage(arr: object, name: string) {
	localStorage.setItem(name, JSON.stringify(arr));
}

// Добавляем значение в созданный массив
export function addNumberStorrage(name: string, number: number) {
	let arr = getArrStorrage(name);

	if (arr) {
		arr.push(number);
		saveArrStorrage(arr, name);
	}
}

// Получаем массив из памяти
export function getArrStorrage(name: string, sort = false) {
	if (!name) return false;
	const arrJson = localStorage.getItem(name);
	if (arrJson) {
		let arr: number[] = JSON.parse(arrJson);

		if (sort) {
			let numbers = arr;
			numbers.sort(function (a, b) {
				return a - b;
			});
			return numbers;
		}
		return arr;
	}

}

// Замкнутая функция - возвращаем массив случайных чисел
// В аргументах - числа диапазон формирования от и до.
// В зависимости от того, сколько нужно случайных чисел - дописать условия if с нужной длиной массива

//new version - внутри функции задать какая длина массива должна быть, в аргументах задать диапазон цифр
// mn - число от, mx - число до, length - длина массива

export function getRandomNumArr(mn: number, mx: number, length: number): number[] {

	const arr: number[] = [];
	let count = 0;

	function back(): any {
		if (count === length) {
			return arr;
		}

		if (arr.length === 0) {
			const num1 = getRandom(mn, mx);
			arr.push(num1);
			count++;
		}

		if (arr.length === count) {
			const num = getRandom(mn, mx);
			if (arr.includes(num)) {
				return back();
			}
			arr.push(num);
			count++;
			return back();
		}
		return [];
	}

	return back();
}

// let randomArr = getRandomNumArr(1, 30, 10);
// console.log(randomArr);


interface CheckCollision {
	x: number,
	y: number,
	width: number,
	height: number
}

export function checkCollision(rect1: CheckCollision, rect2: CheckCollision) {
	return (
		rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.y + rect1.height > rect2.y
	)
}

// Проверка на коллизию определенной стороны. Первый аргумент - не движимый объект, столкновение со стороной которого мы проверяем.
export function checkObjectRightCollision(rect1: CheckCollision, rect2: CheckCollision) {
	if (rect1.x + rect1.width <= rect2.x + 5 && rect1.y - 5 <= rect2.y + rect2.height && rect1.y + rect1.height + 5 > rect2.y) {
		return (
			rect1.x + rect1.width > rect2.x
		)
	}
}

export function checkObjectLeftCollision(rect1: CheckCollision, rect2: CheckCollision) {
	if (rect1.x >= rect2.x + rect2.width - 5 && rect1.y - 5 <= rect2.y + rect2.height && rect1.y + rect1.height + 5 > rect2.y) {
		return (
			rect1.x < rect2.x + rect2.width
		)
	}
}

export function checkObjectTopCollision(rect1: CheckCollision, rect2: CheckCollision) {
	if (rect1.y + 5 >= rect2.y + rect2.height && rect1.x + rect1.width - 5 > rect2.x && rect1.x - 5 < rect2.x + rect2.width) {
		return (
			rect1.y < rect2.y + rect2.height
		)
	}
}

export function checkObjectDownCollision(rect1: CheckCollision, rect2: CheckCollision) {
	if (rect1.y + rect1.height + 2 >= rect2.y && rect1.x + rect1.width - 5 > rect2.x && rect1.x - 5 < rect2.x + rect2.width) {
		return (
			rect1.y + rect1.height > rect2.y
		)
	}
}