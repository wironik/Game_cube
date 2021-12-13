//лабиринт - кнопка меню
function startLabitynth()
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
	createCubes();
	//создаем двери
	createDoors();
	//создаем стены
	createWalls();
	//рисуем карту
	drawElements();

	//привязка стратегии к ивенту
	document.addEventListener('keydown', labirynthStrategy);
	
	//скрываем окно
	document.getElementById('menu').style.display='none';
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapLabirynth,settings.swapInterval);

	timer = setInterval(updateTime, 1000);
}
//функция, необходимая для перемещения куба, в котором находится игрок и отрисовки изменения кадра
function swapLabirynth()
{
	swap();
	refreshLabirynth();
}
//конец игры
function finishLabirynth()
{
	
	document.getElementById('finish').style.display='block';
	clearInterval(interval);
	clearInterval(timer);
	document.getElementById('time').innerHTML ='Время: 00:00:00';
	//document.getElementById('finishTime').innerHTML ='Время: '+hour + ':0' + min + ':0' + sec;
	visualTime('finishTime');
	
	sec=0;
	min=0;
	hour=0;
	
	document.removeEventListener('keydown', labirynthStrategy);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//задаем стратегию, методы для лабиринта которые будут выполняться при нажатии клавиши
function labirynthStrategy()
{
	processKey(event);
	refreshLabirynth();
}

//обновление кадра в лабиринте
function refreshLabirynth()
{
	// Обновляем кадр только если значок движется
	if (user.dx != 0 || user.dy != 0) 
	{
		// получаем текущий куб, в котором находится игрок для получения информации
		var cube=getCube(user.centerx,user.centery);

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
		
		
		if (cube.stat=="finish")
		{
			finishLabirynth();
		}
	}
	//стираем элемент с холста
	ctx.clearRect(user.x, user.y, user.width, user.height);
	//рисуем
	drawElements();
}
//!!!в планах: добавить функцию, которая будет отрисовывать картинку и прочие элементы на холсте для игрока, 
//!!!холсте для элементов, ака текстуры. все процессы в виде кубов будут происходить на функциональном холсте
//отрисовка карты и объектов на холсте
function drawElements()
{
	//рисуем карту
	for(var i=0;i<settings.countCubes;i++)
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			//рисуем кубы
			ctx.fillStyle=map.cubes[i][j].color;
			ctx.fillRect(map.cubes[i][j].x, map.cubes[i][j].y,map.cubes[i][j].width,map.cubes[i][j].height);
			for (var s=0; s<map.cubes[i][j].wall.length; s++)
			{
				//рисуем стены
				ctx.fillStyle=map.cubes[i][j].wallColor;
				ctx.fillRect(map.cubes[i][j].wall[s].x,map.cubes[i][j].wall[s].y,map.cubes[i][j].wall[s].width,map.cubes[i][j].wall[s].height);
			}
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
	//рисуем игрока
	ctx.fillStyle=user.color;
	ctx.fillRect(user.x,user.y, user.width, user.height);
	ctx.strokeRect(user.x,user.y, user.width, user.height);
}

