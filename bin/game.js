//старт - кнопка меню
function startGame()
{
	//берем данные из html содержимого
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	//задаем области рисования и обьекту карты размеры из настроек
	canvas.width=settings.canvasWidth;
	canvas.height=settings.canvasHeight;
	
	//задаем индексы расположения игрока
	user.i=Math.floor(settings.countCubes/2);
	user.j=Math.floor(settings.countCubes/2);
	
	timer = setInterval(updateTime, 1000);
	
	eyes=undefined;
	swapped=undefined;
	
	//создаем кубы
	createCubes(); 
	//создаем двери
	createDoors();
	//cоздаем стены
	for(var i=0;i<settings.countCubes;i++)
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			createWall();
		}
	}
	//задаем статус старотовому кубу
	map.cubes[user.i][user.j].stat="start";
	
	//рисуем карту
	drawCube();

	//привязка кнопок
	document.addEventListener('keydown', function(e){e.preventDefault(); keyStatus[e.keyCode || e.which] = true; },true);
	document.addEventListener('keyup', function(e){e.preventDefault(); keyStatus[e.keyCode || e.which] = false; },true);
	
	//активация кнопок
	processKey();
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapGame,settings.swapInterval);
	
	//скрываем окно
	document.getElementById('menu').style.display='none';
	gameStatus="play";
	
	console.log("start");
}
//функция, необходимая для перемещения куба, в котором находится игрок и отрисовки изменения кадра
function swapGame()
{
	swap();
	refreshGame();
}
//функция, которая выполняется после прохождения лабиринта
function finishGame()
{
	document.getElementById('finish').style.display='flex';
	clearInterval(interval);
	clearInterval(timer);
	
	visualTime('finishTime');
	
	sec=0;
	min=0;
	hour=0;
	
	//document.removeEventListener('keydown', gameStrategy);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	gameStatus="finish";
}
//задаем стратегию, методы для основной игры которые будут выполняться при нажатии клавиши
//function gameStrategy()
//{
//	processKey(event);
//	refreshGame();
//}
//обновление кадра в игре
function refreshGame()
{
	console.log("refresh");
	// получаем текущий куб, в котором находится игрок для получения информации
	var cube=getCube(user.i,user.j);
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
	}
	user.dx=0;
	user.dy=0;
	//стираем холст
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//рисуем
	drawCube();
	if (cube.stat=="finish")
	{
		finishGame();
	}
}
function drawMap(cube)
{
	canvasMap = document.getElementById('maplist');
	ctxMap = canvasMap.getContext('2d');
	
	//задаем области рисования и обьекту карты размеры из настроек
	canvasMap.width=settings.canvasWidth;
	canvasMap.height=settings.canvasHeight;
	
	var cubei=cube.i;
	var cubej=cube.j;
	
	var useri=user.i;
	var userj=user.j;
	
	//фон
	ctxMap.drawImage(mapTexture, 0, 0, 1000, 1000, 0, 0, canvasMap.width, canvasMap.height);
		
	var w=Math.round(canvas.width/settings.countCubes);
	var h=Math.round(canvas.height/settings.countCubes);
		
	//игрок
	ctxMap.drawImage(mapTexture, 1000, 200, 200, 200, user.j*w,user.i*h,w,h);
		
	//крест
	ctxMap.drawImage(mapTexture, 1000, 0, 200, 200, cube.j*w,cube.i*h,w,h);
	
	//отображаем карту
	document.getElementById('maplist').style.display='block';
}
//отрисовка отдельного куба
function drawCube()
{
	var cube=getCube(user.i,user.j);
	for (var i=0; i<cube.cell.length; i++)
	{
		for (var j=0; j<cube.cell.length; j++)
		{
			//ctx.fillStyle=cube.cell[i][j].color;
			//ctx.fillRect(cube.cell[i][j].x,cube.cell[i][j].y,cube.cell[i][j].width,cube.cell[i][j].height);
			
			if (cube.cell[i][j].stat=="normal")
			{
				//ctx.strokeStyle="black";
				//ctx.strokeRect(cube.cell[i][j].x,cube.cell[i][j].y,cube.cell[i][j].width,cube.cell[i][j].height);
				ctx.drawImage(gameTexture, 200, 0, 200, 200, cube.cell[i][j].x,cube.cell[i][j].y,cube.cell[i][j].width,cube.cell[i][j].height)
			}
			else
			{
				ctx.drawImage(gameTexture, 0, 0, 200, 200, cube.cell[i][j].x,cube.cell[i][j].y,cube.cell[i][j].width,cube.cell[i][j].height)
			}
			//рисуем стены
		}
	}

	//рисуем игрока
	//ctx.fillStyle=user.color;
	//ctx.fillRect(user.x,user.y, user.width, user.height);
	//ctx.strokeRect(user.x,user.y, user.width, user.height);
	if (user.dx<0)
	{
		ctx.drawImage(gameTexture, 400, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
	else if (user.dx>0)
	{
		ctx.drawImage(gameTexture, 510, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
	else if (user.dy>0)
	{
		ctx.drawImage(gameTexture, 620, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
	else if (user.dy<0)
	{
		ctx.drawImage(gameTexture, 730, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
	else 
	{
		ctx.drawImage(gameTexture, 620, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
}