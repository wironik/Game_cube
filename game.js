//старт - кнопка меню
function startGame()
{
	//скрываем все элементы, если они не закрыты
	document.getElementById('finish').style.display='none';
	
	//берем данные из html содержимого
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	//получаем размеры игрока, карты и холста
	user.width=Math.round(settings.canvasWidth/settings.countCubes/6);
	user.height=Math.round(settings.canvasHeight/settings.countCubes/6);
	
	//задаем области рисования и обьекту карты размеры из настроек
	map.width=settings.canvasWidth;
	map.height=settings.canvasHeight;
	canvas.width=settings.canvasWidth;
	canvas.height=settings.canvasHeight;
	
	//задаем пользователю расположение в центральном кубе
	user.x=Math.round(map.width/2)-Math.round(user.width/2);
	user.centerx=user.width/2+user.x;
	user.y=Math.round(map.height/2)-Math.round(user.height/2);
	user.centery=user.height/2+user.y;

	//создаем кубы
	createGameCubes();
	//создаем двери
	createDoors();
	//создаем стены
	createWalls();
	//рисуем карту
	drawCube();

	//привязка стратегии к ивенту
	document.addEventListener('keydown', gameStrategy);
	
	//скрываем окно
	document.getElementById('menu').style.display='none';
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swap,settings.swapInterval);
}

function finishGame()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	document.getElementById('finish').style.display='block';
	clearInterval(interval);
	document.removeEventListener('keydown', gameStrategy);
}
//задаем стратегию, методы для основной игры которые будут выполняться при нажатии клавиши
function gameStrategy()
{
	processKey(event);
	refreshGame();
}

//обновление кадра в игре
function refreshGame()
{
	// Обновляем кадр только если значок движется
	if (user.dx != 0 || user.dy != 0) 
	{
		// получаем текущий куб, в котором находится игрок для получения информации
		var cube=getCube(user.centerx,user.centery);
		//стираем холст
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		//Проверка столкновения со стенами
		if (checkCollision(cube)==false) 
		{
			user.x += user.dx;
			user.y += user.dy;
			user.centerx+=user.dx;
			user.centery+=user.dy;
		}
		else
		{
			user.dx=0;
			user.dy=0;
		}
		drawCube();
		
		if (cube.stat=="finish")
		{
			finishGame();
		}
	}
}

//отрисовка отдельного куба
function drawCube()
{
	var cube=getCube(user.centerx,user.centery);

	ctx.fillStyle=cube.color;
	ctx.fillRect(cube.x, cube.y,cube.width,cube.height);
	for (var s=0; s<cube.wall.length; s++)
	{
		//рисуем стены
		ctx.fillStyle=cube.wallColor;
		ctx.fillRect(cube.wall[s].x,cube.wall[s].y,cube.wall[s].width,cube.wall[s].height);
	}

	//рисуем игрока
	ctx.fillStyle=user.color;
	ctx.fillRect(user.x,user.y, user.width, user.height);
	ctx.strokeRect(user.x,user.y, user.width, user.height);
	
	//рисуем отметку финиша
	if (cube.stat=="finish")
	{
		var finishx=cube.x+cube.width/4;
		var finishy=cube.y+cube.height/4;
		var finishw=cube.width/2;
		var finishh=cube.height/2;
		ctx.fillStyle="#fff";
		ctx.fillRect(finishx,finishy, finishw, finishh);
		ctx.strokeRect(finishx,finishy, finishw, finishh);
	}
}





