//глобал, отслеживает клавиши
var keyState = {};    

//привязка ивентов, отключаем клавиши по умолчанию все
document.addEventListener('keydown',function(e){e.preventDefault(); keyState[e.keyCode || e.which] = true;},true); 
document.addEventListener('keyup',function(e){e.preventDefault(); keyState[e.keyCode || e.which] = false;},true);

//сам набор обработчиков
function loop() 
{
    if (keyState[37] || keyState[65])//left
	{
		console.log("-");
    }    
    if (keyState[39] || keyState[68])//right
	{
		console.log("+");
    }
	if (keyState[9])//tab
	{
		console.log("tab");
	}
	if (keyState[112])//f1
	{
		console.log("f1");
	}
    setTimeout(gameLoop, 50);
}  

//активация
loop();

//!!!идея: создаем один луп, и внутри каждого кейкода пихаем условия, если статус такой, делаем то, иначе ничего