
// Получаем коллекцию блоков с атрибутом data-video
const videos = document.querySelectorAll('[data-video]');
const videosParent = document.querySelectorAll('[data-video-parent]');


// Если такие элементы есть на странице - создаем плеер youtube
if (videos.length) {
	let tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	let firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	let player;

	// Каждый блок обязательно должен иметь атрибуты - id, data-id, data-video
	// data-video - это хэш, идентификатор видео из ютуба
	// id, data-id - одинаковый атрибут, по нему скрипт понимает в какой именно блок определяем видео 

	// Структура блока, в который выводим видео из ютуба

	{/* 
// общий блок
<div class="item-video-gallery__video-box video-box">  
	// блок, в который размещаем видео
	<div id="player-2" data-id="player-2" data-video="9HDCb1rysYc"></div> 

	// Иконка, по которой происходит запуск видео
	<div class="item-video-gallery__icon-play icon-play"><span></span>
	</div>

	// Постер, который показывется до загрузки видео
	<div class="item-video-gallery__poster">
		<img src="@img/gallery/posters/poster-1.png" alt="Image">
	</div>
</div> */}

	videosParent.forEach(video => {
		video.addEventListener('click', () => {
			const playerId = video.querySelector('.video-box__video').dataset.id;
			const playerVideo = video.querySelector('.video-box__video').dataset.video;

			player = new YT.Player(playerId, {
				videoId: playerVideo,
				playerVars: {
					'autoplay': 0,
					'controls': 1,
					'playsinline': 1
				},
				events: {
					'onReady': onPlayerReady,
				}
			});
			function onPlayerReady(event) {
				event.target.playVideo();
			}
		})
	})
}

