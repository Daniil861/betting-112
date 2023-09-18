interface IPlayer {
	name: string,
	points: number
}

type TBestScores = IPlayer[];

export const bestScores: TBestScores = [

	{
		name: 'Nightshade Ninja',
		points: 800,
	},
	{
		name: 'Void Walker',
		points: 600,
	},
	{
		name: 'Phoenix Rising',
		points: 400,
	},
	{
		name: 'Stormbringer',
		points: 150,
	},
	{
		name: 'Mystic Sorcerer',
		points: 50,
	},
	{
		name: 'Soul Eater',
		points: 15,
	},
	{
		name: 'User',
		points: 0,
	},
	{
		name: 'Shadow Slayer',
		points: 1000,
	},
]

export function updateBestScoresTable(arr: TBestScores) {
	const sortedArr: TBestScores = sortBestScores(arr);

	const parent = document.querySelector('.table-top-players__body');

	const items = document.querySelectorAll('.table-top-players__line');
	items.forEach(item => item.remove());

	sortedArr.map((item, idx) => {
		const lineBox = document.createElement('div');
		if (idx === 0) lineBox.setAttribute('class', 'table-top-players__line _orange');
		else if (idx === 1) lineBox.setAttribute('class', 'table-top-players__line _gray');
		else if (idx === 2) lineBox.setAttribute('class', 'table-top-players__line _red');
		else if (idx >= 3) lineBox.setAttribute('class', 'table-top-players__line _blue');

		const number = document.createElement('div');
		number.classList.add('table-top-players__number');
		number.textContent = (idx + 1).toString();

		const icon = document.createElement('div');
		icon.classList.add('table-top-players__icon');

		const name = document.createElement('div');
		name.classList.add('table-top-players__name');
		name.textContent = item.name;
		if (item.name === 'User') name.classList.add('_user');

		const points = document.createElement('div');
		points.classList.add('table-top-players__points');
		points.textContent = item.points.toString();

		lineBox.append(number, icon, name, points);

		parent?.append(lineBox);
	})

}

export function sortBestScores(arr: TBestScores) {
	const newArrStr = JSON.stringify(arr);
	const newArr = JSON.parse(newArrStr);
	newArr.sort((a: IPlayer, b: IPlayer) => b.points - a.points);
	return newArr;
}

// Функция, которая перерисовывает таблицу с результатами
updateBestScoresTable(bestScores);

