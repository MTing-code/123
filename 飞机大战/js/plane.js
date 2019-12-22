//获取元素
var container = document.getElementById("container");
var gameCon = document.getElementById("game-con"); //游戏按钮显示box
var startCon = document.getElementById("start-con"); //游戏按钮显示box
var planes = document.getElementById("planes"); //游戏元素box
var endBoard = document.getElementById("end-board"); //结束页面
var suspendBoard = document.getElementById("suspend-board"); //暂停页面
var goOnBtn = document.getElementById("goOn"); //继续按钮
var reStartBtn = document.getElementsByClassName("reStart"); //重新开始按钮
var startBtn = document.getElementById("start"); //开始按钮
var stopBtn = document.getElementById("stop"); //重新开始按钮
var showScores = document.getElementById("score"); //分数显示
var endScore = document.getElementById("endScore"); //结束分数


var totalScore = 0; //初始分数

// 背景移动
var bPY = 0;

function moveBg() {
	bPY += 0.4;
	gameCon.style.backgroundPositionY = bPY + "px";
	if (bPY > 568) {
		bPY = 0;
	}
}
var bgId=setInterval(moveBg, 20); //添加定时器,让背景图片移动


// 飞机的构造函数
function Plane(width, height, flyImg, boomImg, placeX, placeY, deadEndTime, speed, score, bloodVolume,cls) {
	this.planeObj = null; //飞机对象
	this.width = width; //飞机的宽度
	this.height = height; //飞机的高度
	this.flyImg = flyImg; //飞机图片
	this.boomImg = boomImg; //飞机爆炸的图片
	this.placeX = placeX; //飞机横坐标
	this.placeY = placeY; //飞机纵坐标
	this.deadEndTime = deadEndTime; //飞机死亡时间
	this.deadTime = 0; //飞机死亡移除时间
	this.speed = speed || 1; //飞机速度
	this.score = score || 10; //飞机分数
	this.bloodVolume = bloodVolume || 1; //飞机的血量
	this.planeDie = false;
	this.cls=cls||"";
	this.init(); //创建实例对象时立即初始化
}

//为飞机的原型添加初始化方法
Plane.prototype.init = function() {
	//创建飞机的div
	this.planeObj = document.createElement("div");
	//把飞机的div加入到游戏中
	planes.appendChild(this.planeObj);
	// 设置飞机的样式
	this.planeObj.style.width = this.width + "px";
	this.planeObj.style.height = this.height + "px";
	this.planeObj.style.backgroundImage = "url(" + this.flyImg + ")";
	this.planeObj.style.position = "absolute";
	this.planeObj.style.left = this.placeX + "px";
	this.planeObj.style.top = this.placeY + "px";
	this.planeObj.setAttribute("class",this.cls);
}

// 飞机移动的方法
Plane.prototype.move = function() {
	//分数越高,移动速度越快
	if (totalScore <= 300) {
		//小于300的时候正常行驶
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + "px";
	} else if (totalScore > 300 && totalScore <= 800) {
		//分数300-800的时候挂一档
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 1 + "px";
	} else if (totalScore > 800 && totalScore <= 1600) {
		//分数800-1600的时候挂二档
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 2 + "px";
	} else if (totalScore > 1600 && totalScore <= 3000) {
		// 分数1600-3000的时候挂三档
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 3 + "px";
	} else if (totalScore > 3000 && totalScore <= 5000) {
		//分数3000-5000的时候挂四挡
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 4 + "px";
	} else {
		//5000以上挂五档
		this.planeObj.style.top = this.planeObj.offsetTop + this.speed + 5 + "px";
	}
}

// 创建己方飞机
var planeUser = new Plane(66, 80, "image/my.gif", "image/bz.gif", 127, 400);
//己方战机添加id属性值获取元素
$(planeUser.planeObj).attr("id", "myPlane");
var myPlane = document.querySelector("#myPlane");

//飞机跟随鼠标移动
function planeMove(e) {
	//飞机高度和宽度的一半,方便于鼠标居中显示
	var width = planeUser.width / 2;
	var height = planeUser.height / 2;
	//获取游戏div距离浏览器左侧的坐标
	var gameLeft = $(container).position().left;
	var left = e.pageX - gameLeft - width;
	var top = e.pageY - height;
	//判断飞机的最大和最下移动距离
	if (left < -33) {
		left = -33
	} else if (left > 280) {
		left = 280;
	}
	if (top < 0) {
		top = 0;
	} else if (top > 528) {
		top = 528;
	}
	//设置飞机的top和left
	$(myPlane).css({
		left: left,
		top: top
	})
}

//为游戏div绑定鼠标移动事件
$(container).on("mousemove", planeMove);

// 创建子弹的构造函数

function Bullet(pageX, pageY, width, height, img) {
	this.bulletObj = null; //子弹对象,方便调用其他的方法
	this.pageX = pageX || 0; //子弹横坐标
	this.pageY = pageY || 0; //子弹横坐标
	this.width = width; //子弹的宽度
	this.height = height; //子弹的高度
	this.img = img; //子弹的背景图
	this.bulletStrike = 1
	this.init(); //初始化时立即调用子弹init方法
}
Bullet.prototype.init = function() {
	//创建子弹的div
	this.bulletObj = document.createElement("div");
	//为子弹的div添加类样式
	$(this.bulletObj).attr("class", "bullet")
	//把子弹添加到游戏中
	planes.appendChild(this.bulletObj);

	//设置飞机的样式
	$(this.bulletObj).css({
		width: this.width,
		height: this.height,
		position: "absolute",
		backgroundImage: "url(" + this.img + ")",
		left: this.pageX,
		top: this.pageY
	});
}

//子弹移动的原型方法
Bullet.prototype.move = function() {
	$(this.bulletObj).css("top", $(this.bulletObj).position().top - 5); //子弹向上移动
}


var bullets = []; //创建子弹的数组
var enemies = []; //创建敌机的数组

var bInitTime = 0; //创建子弹的时间间隔
var eInitTime = 0; //创建敌机的时间间隔

function start() {
	bInitTime++;
	// 创建子弹
	if (bInitTime % 5 === 0) { //间隔时间创建子弹 不然子弹会连成一线，没有快速移动的感觉
		var newBullet = new Bullet($(myPlane).position().left + 33, $(myPlane).position().top - 10, 6, 14,
			"image/bullet1.png");
		bullets.push(newBullet); //新子弹加入数组中方便操作删除
	}
	// 子弹移动
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].move();
		if (bullets[i].bulletObj.offsetTop < 0) { //如果子弹移出界面，删除子弹
			planes.removeChild(bullets[i].bulletObj); //删除子弹对象
			bullets.splice(i, 1); //从数组中删除当前索引对应的子弹
		}
	}

	//创建敌机
	if (bInitTime == 20) { //出了几个子弹再创建敌机
		eInitTime++; //敌机计次开始
		if (eInitTime % 5 == 0) { //5次循环创建中敌机
			var mEnemy = new Plane(46, 60, "image/enemy3_fly_1.png", "image/zz.gif", random(0, 274), -100, 600, random(1, 2),
				50, 6,"enem");
			enemies.push(mEnemy);
		} else if (eInitTime % 2 == 0) {
			var sEnemy = new Plane(32, 24, "image/enemy1_fly_1.png", "image/xx.gif", random(0, 288), -100, 360, random(1, 3),
				10, 1,"enem");
			enemies.push(sEnemy);
		}
		if (eInitTime == 20) { //20次循环创建大敌机
			var bEnemy = new Plane(110, 164, "image/enemy2_fly_1.png", "image/dd.gif", random(0, 210), -100, 1200, 1, 100,
				12,"enem");
			enemies.push(bEnemy);
			eInitTime = 0;
		}
		bInitTime = 0; //子弹计次归零
	}


	enemies.forEach(function(ele, i) {
		if (ele.planeDie == false) { //证明敌机还活着,让他移动
			ele.move();
		}
		if (ele.planeObj.offsetTop > 568) {
			//敌方战机移出游戏界面,删除div,并且从数组中删除
			planes.removeChild(ele.planeObj);
			enemies.splice(i, 1);
		}
		if (ele.planeDie == true) {
			//敌机死亡,删除div,删除数组中的div
			ele.deadTime += 20;
			if (ele.deadTime == ele.deadEndTime) {
				// 飞机死亡的等待时间等于死亡时间则删除div,并且从数组中移除div
				planes.removeChild(ele.planeObj);
				enemies.splice(i, 1);
			};
		}
	})
// console.log(myPlane.getBoundingClientRect());
// console.log(myPlane[0]);

var enems=[...document.querySelectorAll(".enem")];
var bulls=[...document.querySelectorAll(".bullet")];
// console.log(enems[0]);
	// 碰撞检测

	for (var i = 0; i < bullets.length; i++) {
		for (var j = 0; j < enemies.length; j++) {
			// 判断敌机是否存活
			if (enemies[j].planeDie == false) {
				// 敌机碰撞游戏飞机
				
				if (collision(enems[j],myPlane)) {
					
					if (enemies[j].planeObj.offsetTop + enemies[j].height >= myPlane.offsetTop + 40 && myPlane.offsetTop - 20 +
						myPlane.offsetHeight >= enemies[j].planeObj.offsetTop) {
						//碰撞后执行		
						clearInterval(bgTimeId);//停止飞机移动
						// removeEventListener(document, "mousemove", planeMove);//停止飞机跟鼠标移动
						$(container).off("mousemove");
						myPlane.style.backgroundImage = "url('" + planeUser.boomImg + "')"; //游戏飞机爆炸图片
						enemies[j].planeObj.style.backgroundImage = "url('" + enemies[j].boomImg + "')"; //敌机爆炸图片
						enemies[j].planeDie = true; //敌机死亡
						endBoard.style.display = "block";
						endScore.innerHTML=totalScore;
					}
				}
				// 子弹碰撞敌机
				
				if (collision(enems[j],bulls[i])) {
						//碰撞后执行	
						enemies[j].bloodVolume = enemies[j].bloodVolume - bullets[i].bulletStrike; //敌机血量减去子弹攻击力
						if (enemies[j].bloodVolume == 0) { //血量为0 敌机死亡 换图片 改状态 加分数
							totalScore += enemies[j].score;
							showScores.innerText = totalScore;
							enemies[j].planeObj.style.backgroundImage = "url('" + enemies[j].boomImg + "')"; //敌机爆炸图片
							enemies[j].planeDie = true;
                            var sound=document.getElementById("sound");
                            sound.currentTime=10; //从音乐文件的第40秒开始播放
                            sound.play();
                            //播放2秒后停止
                            setTimeout(function(){
                                sound.pause();
                            },2000);
                        }
						planes.removeChild(bullets[i].bulletObj); //删除子弹对象
						bullets.splice(i, 1);
						break;
				
				}
			}
		}
	}






}

// 为按钮绑定事件
var inTheGame=true;
function suspend() {
	clearInterval(bgTimeId);
	if (inTheGame===true) {
		suspendBoard.style.display="block";//显示暂停页面
		$(container).off("mousemove");//停止飞机跟鼠标移动
		clearInterval(bgTimeId);//停止飞机移动
		inTheGame = false;
	}else{
		suspendBoard.style.display = "none";//隐藏暂停页面
		bgTimeId = setInterval(start, 20);//飞机继续移动
		$(container).on("mousemove", planeMove);//飞机跟鼠标移动
		inTheGame = true;
	}
}



// 停止游戏函数
function stop() {
	startCon.style.display = "block";
	gameCon.style.display = "none";
	planes.style.display = "none";
	suspendBoard.style.display = "none";
	clearInterval(bgTimeId);//停止飞机移动
	$(container).off("mousemove");//停止飞机跟鼠标移动
}


//开始游戏函数
var bgTimeId;
function begin() {
	startCon.style.display = "none";
	suspendBoard.style.display = "none";
	gameCon.style.display = "block";
	planes.style.display = "block";
	clearInterval(bgTimeId);
	bgTimeId = setInterval(start, 20);//飞机继续移动
	// addEventListener(document, "mousemove", planeMove);//飞机跟鼠标移动
	$(container).on("mousemove", planeMove);
	inTheGame = true;
}


//重新开始游戏
function reStart() {
	location.reload(true);
}


$(planes).on("click",suspend);//游戏界面的点击事件
$(goOnBtn).on("click",suspend);//暂停按钮的点击事件
$(startBtn).on("click",begin);//开始按钮的点击事件
$(stopBtn).on("click",stop);//重新开始按钮的点击事件
$(reStartBtn).on("click",reStart);//使用

// console.log(reStart);
// for (var i = 0; i < reStart.length; i++) {
// 	reStart[i].onclick=reStart;
// }





//随机数方法
function random(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

// 碰撞检测函数
function getRect(obj){
		return obj.getBoundingClientRect();
		}
function collision(obj1,obj2){
		var obj1Rect = 	getRect(obj1);
		var obj2Rect = 	getRect(obj2);
	 
		//如果obj1碰上了obj2返回true，否则放回false
		var obj1Left = obj1Rect.left;
		var obj1Right = obj1Rect.right;
		var obj1Top = obj1Rect.top;
		var obj1Bottom = obj1Rect.bottom;
	 
		var obj2Left = obj2Rect.left;
		var obj2Right = obj2Rect.right;
		var obj2Top = obj2Rect.top;
		var obj2Bottom = obj2Rect.bottom;
	 
		if( obj1Right < obj2Left || obj1Left > obj2Right || obj1Bottom < obj2Top || obj1Top > obj2Bottom ){
			return false;
		}else{
			return true;
		}
	}