// Имеем разметку в которой три круга находятся друг в друге

{/* <div class="circle-big">
	<div class="circle-middle">
		<div class="circle-small"></div>
	</div>
</div>	 */}

// CSS - абсолютно позиционируем родительский круг в окне браузера, а остальные круги позиционируем в центре относительно родительского круга
// .circle-big {
// 	position: absolute;
// 	top: 50%;
// 	left: 20%;
// 	transform: translateY(-50%);

// 	width: 150px;
// 	height: 150px;
// 	border-radius: 50%;
// 	border: 2px solid #fff;

// }
// .circle-middle {
// 	position: absolute;
// 	top: 50%;
// 	left: 50%;
// 	transform: translate(-50%, -50%);

// 	width: 100px;
// 	height: 100px;
// 	border-radius: 50%;
// 	border: 2px solid #fff;

// }

// .circle-small {
// 	position: absolute;
// 	top: 50%;
// 	left: 50%;
// 	transform: translate(-50%, -50%);

// 	width: 50px;
// 	height: 50px;
// 	border-radius: 50%;
// 	border: 2px solid #fff;

// }


const circleBig = document.querySelector('.circle-big');
const circleMiddle = document.querySelector('.circle-middle');
const circleSmall = document.querySelector('.circle-small');

const configCircle = {
	mouse: {
		x: 0,
		y: 0
	},
}
// Отслеживаем координату курсора мыши, записываем ее в конфиг
document.addEventListener('mousemove', (e) => {
	configCircle.mouse.x = e.offsetX;
	configCircle.mouse.y = e.offsetY;
})


// Анимация - зацикливаем.
function animateCircle() {
	moveInnerCircle();
	requestAnimationFrame(animateCircle);
}
animateCircle();

// Здесь производим все вычисления
function moveInnerCircle() {
	// Получаем координату родительского круга (можно и другими путями получить, просто я выбрал такой)
	const dataBig = circleBig.getBoundingClientRect();

	// Вычисляем расстояние по осям x и y, от родительского круга до курсора
	const dx = configCircle.mouse.x - dataBig.x;
	const dy = configCircle.mouse.y - dataBig.y;
	// На основании данных расстояния получаем угол в радианах с помощью atan2
	const angle = Math.atan2(dy, dx);

	// Далее используем sin и cos для добавления небольшого количества пикселей - таким образом мы анимируем внутренние круги -
	//  они будут тянуться к курсору на расстояние которое укажем. Я указал 15, но можно указать то значение которое будет нужно

	circleMiddle.style.transform = `translate(calc(-50% + ${Math.cos(angle) * 15}px), calc(-50% + ${Math.sin(angle) * 15}px))`;
	circleSmall.style.transform = `translate(calc(-50% + ${Math.cos(angle) * 15}px), calc(-50% + ${Math.sin(angle) * 15}px))`;
}