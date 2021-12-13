//функция, задающая глобальным переменным параметры
function start()
{
	//скрываем все элементы, если они не закрыты
	document.getElementById('finish').style.display='none';
	document.getElementById('pause').style.display='none';
	
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
	
	timer = setInterval(updateTime, 1000);
	
	eyes=undefined;
	swapped=undefined;
	
	//скрываем окно
	document.getElementById('menu').style.display='none';
}
//счетчик времени
function updateTime()
{
    sec++;
    if (sec >= 60) 
	{ //задаем числовые параметры, меняющиеся по ходу работы программы
        min++;
        sec = sec - 60;
    }
    if (min >= 60) 
	{
        hour++;
        min = min - 60;
    }
    visualTime('time');
	//console.log(hour,min,sec);
}
//отображение времени на любом из элементов html в формате hh:mm:ss
function visualTime(id)
{
	if (sec < 10) 
	{ 
        if (min < 10) 
		{
            if (hour < 10) 
                document.getElementById(id).innerHTML ='Время: 0' + hour + ':0' + min + ':0' + sec;
			else 
                document.getElementById(id).innerHTML ='Время: ' + hour + ':0' + min + ':0' + sec;
		}
		else 
		{
            if (hour < 10) 
                document.getElementById(id).innerHTML = 'Время: 0' + hour + ':' + min + ':0' + sec;
			else 
                document.getElementById(id).innerHTML = 'Время: ' + hour + ':' + min + ':0' + sec;
        }
    } 
	else 
	{
        if (min < 10) 
		{
            if (hour < 10) 
                document.getElementById(id).innerHTML = 'Время: 0' + hour + ':0' + min + ':' + sec;
			else 
                document.getElementById(id).innerHTML = 'Время: ' + hour + ':0' + min + ':' + sec;
        } 
		else 
		{
            if (hour < 10) 
                document.getElementById(id).innerHTML = 'Время: 0' + hour + ':' + min + ':' + sec;
			else 
                document.getElementById(id).innerHTML = 'Время: ' + hour + ':' + min + ':' + sec;
        }
    }
}
// Обработка нажатия кнопок
function processKey(e) 
{
	//console.log(e.keyCode);
	
	//блокируем нажатие клавиш по умолчанию (сами будем задавать нужное)
	e.preventDefault();
	// Если значок находится в движении, 
	// останавливаем его
	user.dx = 0;
	user.dy = 0;
	// Если нажата стрелка вверх, 
	// начинаем двигаться вверх
	if (e.keyCode == 87 || e.keyCode ==38) 
		user.dy = -1*user.speed;
	// Если нажата стрелка вниз, 
	// начинаем двигаться вниз
	if (e.keyCode == 83 || e.keyCode ==40) 
		user.dy = user.speed;
	// Если нажата стрелка влево, 
	// начинаем двигаться влево
	if (e.keyCode == 65 || e.keyCode ==37) 
		user.dx = -1*user.speed;
	// Если нажата стрелка вправо, 
	// начинаем двигаться вправо
	if (e.keyCode == 68 || e.keyCode ==39) 
		user.dx = user.speed;
	//если нажат пробел,
	//меняем куб, в котором находится игрок с любым подходящим
	if (e.keyCode == 32)
		teleport();
	if (e.keyCode == 9)
		openMap();
	if (e.keyCode == 112)
		help();
	if (e.keyCode == 27)
		menu();
}
//обработка функции нажатия на пробел - принудительное перемещение куба
function teleport()
{
	if (swapped==undefined)
	{
		teleportUser();
		swapped=setTimeout(function(){swapped=undefined;}, settings.teleportTime);
	}
}
//обработка функции нажатия на таб - показать всю карту на некоторое время, работает один раз
function openMap()
{
	if (eyes==undefined)
	{
		drawLabirynth();
		eyes=setTimeout(function(){drawLabirynth();}, 5);
	}
}
//отображение окна подсказки
function help()
{
	if (document.getElementById('help').style.display=='block')
		document.getElementById('help').style.display='none';
	else
		document.getElementById('help').style.display='block';
}
//закрытие окна подсказки
function closeHelp()
{
	document.getElementById('help').style.display='none';
}
//открытие главного меню
function menu()
{
	ctx.clearRect(0, 0, map.width, map.height);
	document.getElementById('finish').style.display='none';
	document.getElementById('menu').style.display='block';
	clearInterval(interval);
	clearInterval(timer);
	sec=0;
	min=0;
	hour=0;
	document.getElementById('time').innerHTML ='Время: 00:00:00';
	document.removeEventListener('keydown', gameStrategy);
	document.removeEventListener('keydown', labirynthStrategy);
}
//!!!разобраться с паузой!!!!
function pause()
{
	document.getElementById('pause').style.display='block';
	document.getElementById('resume').onclick="";
	clearInterval(interval);
	clearInterval(timer);
	document.removeEventListener('keydown', gameStrategy);
	document.removeEventListener('keydown', labirynthStrategy);
}
//!!!возобновить игру
function resumeGame()
{
	
}
//!!!возобновить лабиринт
function resumeLabitynth()
{
	
}
//поиск куба, в котором находится игрок
function getCube(x,y,w,h)
{
	for(var i=0;i<settings.countCubes;i++)//столбцы
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			var minx=map.cubes[i][j].x;
			var miny=map.cubes[i][j].y;
			var maxx=map.cubes[i][j].x+map.cubes[i][j].width;
			var maxy=map.cubes[i][j].y+map.cubes[i][j].height;
				
			if((minx<x) && (x<maxx)&& (miny<y)&& (y<maxy) )
			{
				//console.log("cube:",i,j);
				return map.cubes[i][j];
				break;
			}
		}
	}
}
//проверка столкновений
function checkCollision(cube)
{	
	//!!! добавить изменение dx , чтобы примыкать к стене вплотную, если столкновение true
	
	//предполагаемые координаты, если бы совершили шаг
	var x=user.x+user.dx;
	var y=user.y+user.dy;
	var w=x+user.width;
	var h=y+user.height;
	
	//здесь идет проверка со стенами
	//шаг вверх
	if (user.dy<0)
	{
		if (cube.door[0]==true)
		{
			//если дверь в кубе имеется, проверяем две стены с возможностью пройти в проход
			if (y<cube.y+cube.wallSize && (x<Math.round(cube.width/3)+cube.x || w>Math.round(cube.width/3*2)+cube.x))
				return true;
			//если мы идем вверх, находясь в промежутке левых или правых дверей
			else if (y<Math.round(cube.height/3)+cube.y &&(x<cube.x+cube.wallSize  ||  w>cube.x+cube.width-cube.wallSize))
				return true;
			else return false;
		}
		else
		//если двери нет, то проверяем целую стену
		{
			if (y<cube.y+cube.wallSize)
				return true;
			//если находимся в промежутке правых или левых дверей
			else if (y<Math.round(cube.height/3)+cube.y &&(x<cube.x+cube.wallSize  ||  w>cube.x+cube.width-cube.wallSize))
				return true;
			else return false;
		}
	}
	else if (user.dx<0)
	{
		if (cube.door[1]==true)
		{
			//промежуток
			if (x<cube.x+cube.wallSize && (y<Math.round(cube.height/3)+cube.y || h>Math.round(cube.height/3*2)+cube.y))
				return true;
			else if (x<Math.round(cube.width/3)+cube.x &&(y<cube.y+cube.wallSize  ||  h>cube.y+cube.height-cube.wallSize))
				return true;
			else return false;
		}
		else
		//целиком
		{
			if (x<cube.x+cube.wallSize)
				return true;
			else if (x<Math.round(cube.width/3)+cube.x &&(y<cube.y+cube.wallSize  ||  h>cube.y+cube.height-cube.wallSize))
				return true;
			else return false;
		}
	}
	else if (user.dy>0)
	{
		if (cube.door[2]==true)
		{
			if (h>cube.y+cube.height-cube.wallSize && (x<Math.round(cube.width/3)+cube.x || w>Math.round(cube.width/3*2)+cube.x))
				return true;
			else if (h>Math.round(cube.height/3*2)+cube.y &&(x<cube.x+cube.wallSize  ||  w>cube.x+cube.width-cube.wallSize))
				return true;
			else return false;
		}
		else
		//целиком
		{
			if (h>cube.y+cube.height-cube.wallSize)
				return true;
			else if (h>Math.round(cube.height/3*2)+cube.y &&(x<cube.x+cube.wallSize  ||  w>cube.x+cube.width-cube.wallSize))
				return true;
			else return false;
		}
	}
	else if (user.dx>0)
	{
		if (cube.door[3]==true)
		{
			//промежуток
			if (w>cube.x+cube.width-cube.wallSize && (y<Math.round(cube.height/3)+cube.y || h>Math.round(cube.height/3*2)+cube.y))
				return true;
			else if (w>Math.round(cube.width/3*2)+cube.x &&(y<cube.y+cube.wallSize  ||  h>cube.y+cube.height-cube.wallSize))
				return true;
			else return false;
		}
		else
		//целиком
		{
			if (w>cube.x+cube.width-cube.wallSize)
				return true;
			else if (w>Math.round(cube.width/3*2)+cube.x &&(y<cube.y+cube.wallSize  ||  h>cube.y+cube.height-cube.wallSize))
				return true;
			else return false;
		}
	}
}
//функция смены местами кубов с одинаковыми дверями
function swap()
{	
	//console.log("swap");
	//функция сравнения содержимого двух одномерных массивов
	function compareArrays(a, b) 
	{
		if (a.length == b.length) 
		{
			for (var i = 0; i < a.length; i++) 
			{
				if (a[i] !== b[i]) 
				{
					return false;
				}
			}
			return true;
		}
		return false;
	}
	//получаем текущий куб, в котором находится игрок
	var cube=getCube(user.centerx,user.centery);
	//рандомом ищем i,j rand = min + Math.random() * (max + 1 - min);
	var randi=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
	var randj=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
	//console.log("rand:",randi,randj);
	
	//временные переменные, хранящие индексы искомого куба
	var tempi=randi;
	var tempj=randj;
		
	//проверяем совпадение массива дверей, если ок оставляем, если нет, ищем дальше, до тех пор, пока все кубы не проверим
	var newCube=map.cubes[randi][randj];
	
	//переменная ошибки
	var stop=0;
	
	//прокручиваем цикл до тех пор, пока не найдем подходящий куб
	while(compareArrays(cube.door, newCube.door)==false)
	{
		//прокрутка массива кубов без пограничных кубов и того, в котором находится игрок
		if (tempi+1>settings.countCubes-2)
		{
			if (tempj+1>settings.countCubes-2)
				tempj=1;
			else if (tempj+1==cube.j&&tempi==cube.i)
				tempj+=2;
			else
				tempj++;
			tempi=1;
		}
		else if (tempi+1==cube.i&&tempj==cube.j)
			tempi+=2;
		else
			tempi++;
		//console.log("temp:",tempi,tempj,"user:",cube.i,cube.j);
		
		//получаем обьект куба с текущими временными индексами для дальнейшей проверки
		newCube=map.cubes[tempi][tempj];
		
		//если не нашли подходящий куб, то принудительно выходим из цикла
		if (tempi==randi&&tempj==randj)
		{
			console.log("no search");
			break;
		}
		
		//на случай, если вдруг произошла бесконечная прокрутка
		stop++;
		if (stop>100)
		{
			//console.log("error: infinity");
			break;
		}
	}
	//console.log("last:",tempi,tempj,"cube:",cube.i,cube.j);
	
	//если нашли, то в массиве кубов меняем элементы местами
	if (compareArrays(cube.door, newCube.door)==true)
	{
		//сохраняем расположение старого куба
		var oldi=cube.i;
		var oldj=cube.j;
		
		//меняем местами цвета стен
		var swapWallColor = cube.wallColor;
		cube.wallColor = newCube.wallColor;
		newCube.wallColor = swapWallColor;
		
		//меняем местами цвета кубов
		var swapColor = cube.color;
		cube.color = newCube.color;
		newCube.color = swapColor;
		
		//меняем кубы
		map.cubes[oldi][oldj]=cube;
		map.cubes[tempi][tempj]=newCube;
		
		//console.log("sucsess");
		
		//меняем расположение игрока, чтобы он сохранился в старом кубе
		var deltax=Math.round(user.x-map.cubes[oldi][oldj].x);
		var deltay=Math.round(user.y-map.cubes[oldi][oldj].y);
		
		user.x=Math.round(map.cubes[tempi][tempj].x+deltax);
		user.y=Math.round(map.cubes[tempi][tempj].y+deltay);
		user.centerx=user.width/2+user.x;
		user.centery=user.height/2+user.y;
	}
	//console.log("end swap");
}
//функция, которая перемещает только игрока в новый куб
function teleportUser()
{
	//получаем текущий куб, в котором находится игрок
	var cube=getCube(user.centerx,user.centery);
	
	//рандомом ищем i,j rand = min + Math.random() * (max + 1 - min);
	var randi=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
	var randj=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
	
	//получаем будущий куб, в который будет перемещен игрок
	var newCube=map.cubes[randi][randj];
	
	//меняем расположение игрока, чтобы он сохранился в старом кубе
	var deltax=Math.round(user.x-map.cubes[cube.i][cube.j].x);
	var deltay=Math.round(user.y-map.cubes[cube.i][cube.j].y);
		
	user.x=Math.round(map.cubes[randi][randj].x+deltax);
	user.y=Math.round(map.cubes[randi][randj].y+deltay);
	user.centerx=user.width/2+user.x;
	user.centery=user.height/2+user.y;
}
