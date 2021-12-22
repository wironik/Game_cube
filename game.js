//старт - кнопка меню
function startGame()
{
	start();
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
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapGame,settings.swapInterval);
}
//старт - кнопка меню
function startHardGame()
{
	start();
	//создаем кубы
	createGameCubes();
	//создаем двери
	createDoors();
	//создаем стены
	createWalls();
	//рисуем карту
	//drawCube();
	refreshHardGame();
	//привязка стратегии к ивенту
	document.addEventListener('keydown', gameHardStrategy);
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapHardGame,settings.swapInterval);
}

//функция, необходимая для перемещения куба, в котором находится игрок и отрисовки изменения кадра
function swapGame()
{
	swap();
	refreshGame();
}
//функция, необходимая для перемещения куба, в котором находится игрок и отрисовки изменения кадра
function swapHardGame()
{
	swap();
	refreshHardGame();
}
//функция, которая выполняется после прохождения лабиринта
function finishGame()
{
	document.getElementById('finish').style.display='block';
	clearInterval(interval);
	clearInterval(timer);
	
	document.getElementById('time').innerHTML ='Время: 00:00:00';
	visualTime('finishTime');
	
	sec=0;
	min=0;
	hour=0;
	
	document.removeEventListener('keydown', gameStrategy);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
//задаем стратегию, методы для основной игры которые будут выполняться при нажатии клавиши
function gameStrategy()
{
	processKey(event);
	refreshGame();
}
//задаем стратегию, методы для основной игры которые будут выполняться при нажатии клавиши
function gameHardStrategy()
{
	processKey(event);
	refreshHardGame();
}
//обновление кадра в игре
function refreshGame()
{
	// получаем текущий куб, в котором находится игрок для получения информации
	var cube=getCube(user.centerx,user.centery);
	// Обновляем кадр только если значок движется
	if (user.dx != 0 || user.dy != 0) 
	{
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
	}
	//стираем холст
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//рисуем
	drawCube();
	if (cube.stat=="finish")
	{
		finishGame();
	}
}

//обновление кадра в игре
function refreshHardGame()
{
	// получаем текущий куб, в котором находится игрок для получения информации
	var cube=getCube(user.centerx,user.centery);
	// Обновляем кадр только если значок движется
	if (user.dx != 0 || user.dy != 0) 
	{
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
	}
	//стираем холст
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//рисуем
	//рисуем игрока
	ctx.fillStyle=user.color;
	ctx.fillRect(user.x,user.y, user.width, user.height);
	ctx.strokeRect(user.x,user.y, user.width, user.height);
	
	//рисуем карту
	for(var i=0;i<settings.countCubes;i++)
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			if (map.cubes[i][j].stat=="finish")
			{
				//рисуем отметку финиша
				var finishx=map.cubes[i][j].x+map.cubes[i][j].width/4;
				var finishy=map.cubes[i][j].y+map.cubes[i][j].height/4;
				var finishw=map.cubes[i][j].width/2;
				var finishh=map.cubes[i][j].height/2;
				ctx.fillStyle="#fff";
				ctx.fillRect(finishx,finishy, finishw, finishh);
				ctx.strokeRect(finishx,finishy, finishw, finishh);
			}
		}
	}
	
	if (cube.stat=="finish")
	{
		finishGame();
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





