// Conditionally initialize the options.
if (!localStorage.isInitialized) {
	localStorage.refresh_interval = 1; // The display frequency, in minutes.
	localStorage.refresh_interval_text = '1 раз в минуту';
	localStorage.isInitialized = true; // The option initialization.
	localStorage.audioOn = true;
}

var discussURL = '';

var audio = new Audio("click.ogg");


chrome.browserAction.setBadgeBackgroundColor({
	color: '#d22d2d'
});

chrome.alarms.create('refresh', {
	periodInMinutes: +localStorage.refresh_interval
});

chrome.alarms.onAlarm.addListener(onAlarm);

function onAlarm() {

	// Создаём асинхронный запрос к серверу
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://hondasteed.org.ru/forumnew/search.php?search_id=egosearch', true);

	// Отправляем запрос на сервер
	xhr.send('');

	// Отслеживаем состояние запроса
	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return;

		// Если ответ сервера не OK
		if (xhr.status != 200) {
			chrome.browserAction.setBadgeText({
				text: '---'
			});
			return;
		}


		// Получаем содержимое страницы "Ваши сообщения"
		var pageText = xhr.response;

		// Ищем на этой странице позицию начала подстроки 'unread#unread' (это часть ссылки на последнее непрочитанное сообщение)
		var classStringPosition = pageText.indexOf('unread#unread');
		// Если такой подстроки нет - выходим
		if (classStringPosition == -1) return chrome.browserAction.setBadgeText({ text: '' });;

		// Находим позицию символа " - конец ссылки
		var quotePositionStart = pageText.indexOf('"', classStringPosition);
		// Находим позицию символа " - начало ссылки
		var quotePositionEnd = pageText.lastIndexOf('"', classStringPosition);

		// Зная эти позиции извлекаем саму ссылку
		discussURL = pageText.slice(quotePositionEnd + 2, quotePositionStart);

		// Преобразовываем HTML-сущности в текст
		var txt = document.createElement("textarea");
		txt.innerHTML = discussURL;
		discussURL = txt.value;

		if (discussURL) {
			// result - это текущий текст на иконке расширения
			chrome.browserAction.getBadgeText({}, function(result) {
				if (result != '1' && localStorage.audioOn) audio.play();
			});
			chrome.browserAction.setBadgeText({
				text: '1'
			});
		} else {
			chrome.browserAction.setBadgeText({
				text: ''
			});
		}

	};

}


chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({
		'url': 'http://hondasteed.org.ru/forumnew' + discussURL
	}, function(tab) {
		setTimeout(function() {
			onAlarm();
		}, 5000);
	});
});