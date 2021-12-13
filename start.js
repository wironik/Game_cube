//============глобальные переменные:==============

//элементы html документа
var canvas;
var ctx;

//события
var interval;

//таймер
var timer;

var sec=0;
var min=0;
var hour=0;

//настройки
var settings =
{
	countCubes:23,
	canvasWidth:document.documentElement.clientWidth*2,
	canvasHeight:document.documentElement.clientHeight*2,
	wallSize: 7,
	swapInterval:30000
};

//игрок
var user=
{
	width:0,
	height:0,
	dx:0, //смещение по х
	x:60,
	centerx:30,
	dy:0, //смещение по у
	y:60,
	centery:30,
	speed:7,
	color:"red"
}

//карта
var map=
{
	width:0,
	height:0,
	x:0,
	y:0,
	color:"#ffffff",
	cubes:[]
}

//кубы
class cube
{
	constructor(width,height,x,y,i,j,color)
	{
		this.width=width;
		this.height=height;
		this.x=x;
		this.y=y;
		this.i=i;
		this.j=j;
		this.color=color;
		this.wall=[];
		this.door=[];
		
		this.wallSize=settings.wallSize;
		this.wallColor="black";
		this.stat="normal";
	}
}

//стены
class wall
{
	constructor(width,height,x,y,color)
	{
		this.width=width;
		this.height=height;
		this.x=x;
		this.y=y;
		this.color=color;
	}
}



