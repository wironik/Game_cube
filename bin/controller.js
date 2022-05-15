// Обработка нажатия кнопок
function processKey() 
{
	
	//блокируем нажатие клавиш по умолчанию (сами будем задавать нужное)
	//e.preventDefault();
	if (gameStatus=="play")
	{
		let refreshed = false;
		
		if (keyStatus[87] || keyStatus[38]) //вверх
		{
			user.dy = -1*user.speed;
			refreshed = true;
		}
		if (keyStatus[83] || keyStatus[40]) //вниз
		{
			user.dy = user.speed;
			refreshed = true;
		}
		if (keyStatus[65] || keyStatus[37]) //влево
		{
			user.dx = -1*user.speed;
			refreshed = true;
		}
		if (keyStatus[68] || keyStatus[39]) //вправо
		{
			refreshed = true;
			user.dx = user.speed;
		}
		if (keyStatus[32])//пробел
		{
			refreshed = true;
			teleport();
		}
		if (keyStatus[9])//tab
		{
			refreshed = true;
			openMap();
			keyStatus[9]=null;
		}
		if (keyStatus[27])//esc
			menu();	
		
		//мое
		if (keyStatus[120])//f9 финиш отладка
			finishGame();
		if (refreshed==true)
		{
			refreshGame();
		}
		
	}
	if (gameStatus=="map")
	{
		if (keyStatus[27] || keyStatus[9])//esc, tab
		closeMap();
		keyStatus[9]=null;
	}
	
	if (keyStatus[112])//f1
		displayed('help');

	
	setTimeout(processKey, 50);
}

//!проблема1: каждые 100мс функция делает проверки, такое не надо. 
//!проблема2: при нажатии таб кнопка два раза срабатывает (открытие и закрытие соответственно, изза проблемы1)
//!проблема3: данные остаются в массиве 