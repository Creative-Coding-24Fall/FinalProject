let positiveKaomojis = [
  "(⁄⁄>⁄▽⁄<⁄⁄)",
  "(*´▽`*)",
  "(≧◡≦)",
  "٩(๑❛ᴗ❛๑)۶",
  "(*＾▽＾)／",
  "(๑˃ᴗ˂)ﻭ",
  "✧(≖ ◡ ≖✿)",
  "＼(＾▽＾)／",
  "(*´︶`*)♡",
  "(^_−)☆",
];
let negativeKaomojis = [
  "(︶︹︺)",
  "(；′⌒`)",
  "(╯︵╰,)",
  "(>_<)",
  "( T⌓T )",
  "(ノ_<。)",
  "(￣□￣」)",
  "(；´Д｀)",
  "(ಥ﹏ಥ)",
  "｡ﾟ(´Д｀ﾟ)ﾟ｡",
];
let neutralKaomojis = [
  "(￣_￣)",
  "(・・ ) ?",
  "( ・_・)ノ",
  "(¬_¬)",
  "(・_・;)",
  "(　-_･)",
  "┐(´-｀)┌",
  "（￣ー￣）",
  "(´・ω・`)",
  "(-_-;)",
];
let allKaomojis = [positiveKaomojis, negativeKaomojis, neutralKaomojis]; //将所有颜表情放进一个数组
let kaomojis = []; //存储弹幕表情的数组
let interval; //行间距
let lastRow = [-1, -1]; //前两次颜表情创建位置的行数
let rows = 7;//总行数
let gameState = "start";//游戏状态
let level = 1;
let overTime;

let connectButton;
let mSerial;
let readyToReceive;
let buttonStates = [false, false, false]; //按钮是否按下
let buttonTimes = [0, 0, 0]; //按钮按下时间
let buttonPreare = [0, 0, 0]; //按钮是否完成准备
let kaomojiMaxNumber =1
let kaomojiTypes = [0, 0, 0];//每种表情出现次数
let playerAnswers = [0, 0, 0];
let alphaList = [0, 0, 0];

function receiveSerial() {
  // 接受处理arduino数据的代码
  let line = mSerial.readUntil("\n");

  // 根据 Arduino 的数据更新按钮状态
  if (line.startsWith("Button 1 pressed")) {
    buttonStates[0] = true;
  } else if (line.startsWith("Button 1 released")) {
    buttonStates[0] = false;
  } else if (line.startsWith("Button 2 pressed")) {
    buttonStates[1] = true;
  } else if (line.startsWith("Button 2 released")) {
    buttonStates[1] = false;
  } else if (line.startsWith("Button 3 pressed")) {
    buttonStates[2] = true;
  } else if (line.startsWith("Button 3 released")) {
    buttonStates[2] = false;
  }
  //from gpt

  if (gameState == "play") {
    // 游戏开始后 玩家按下按钮 其答案+1
    if (line.startsWith("Button 1 pressed")) {
      playerAnswers[0] += 1;
    } else if (line.startsWith("Button 2 pressed")) {
      playerAnswers[1] += 1;
    } else if (line.startsWith("Button 3 pressed")) {
      playerAnswers[2] += 1;
    }
  }
}

function connectToSerial() {
  // 链接arduino
  if (!mSerial.opened()) {
    mSerial.open(9600);
    connectButton.hide();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  interval = height / rows;//计算行间距
  mSerial = createSerial();
  connectButton = createButton("Connect To Serial");
  connectButton.position(0, 0);
  connectButton.mousePressed(connectToSerial);
  frameRate(30);
}

function initialization() {
  // 出事化所需数据
  buttonPreare = [0, 0, 0]; //按钮是否完成准备
  kaomojiTypes = [0, 0, 0];
  playerAnswers = [0, 0, 0];
  alphaList = [0, 0, 0];
  kaomojis = [];
  buttonTimes = [0, 0, 0];
}

function draw() {
  kaomojiMaxNumber = level * 10;

  switch (gameState) {
    case "start":
      start();
      break;
    case "play":
      gaming();
      break;
    case "over":
      over();
      break;
  }
  if (mSerial.availableBytes() > 0) {
    receiveSerial();
  }
}

function keyPressed() {
  if (gameState == "start") {
    if (keyCode == LEFT_ARROW) {
      level -= 1;
    } else if (keyCode == RIGHT_ARROW) {
      level += 1;
    }
    if (level < 1) {
      level = 1;
    }
    if (level > 10) {
      level = 10;
    }
  }
}

function start() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(width * 0.1);
  fill(255, 100);
  text("LEVEL:" + level, width / 2, height / 2);
  fill(255);
  textSize(height * 0.05);
  text("READY?", width / 2, height * 0.7);
  textSize(height*0.03)
  text("HOLD DOWN THE BUTTON!", width / 2, height * 0.75);
  let allPrepare = true;

  for (let i = 0; i < 3; i++) {
    push();
    let x = map(i, -1, 3, 0, width);
    let y = height * 0.5;
    let shakey;
    if (buttonPreare[i] == 0) {
      shakey = map(buttonTimes[i], 0, 90, 0, 8);
      allPrepare = false;
    } else {
      shakey = 0;
    }

    translate(x + random(-shakey, shakey), y + random(-shakey, shakey));
    fill(255);
    if (buttonStates[i]) {
      buttonTimes[i] += 1;
      fill(180);
    } else {
      buttonTimes[i] = 0;
    }

    noStroke();
    ellipse(0, 0, 40); //中间圆
    stroke(255);
    strokeWeight(5);
    noFill();
    let angle = map(buttonTimes[i], 0, 90, 0, TWO_PI);
    if (buttonPreare[i] == 0) {
      arc(0, 0, 60, 60, -PI / 2, -PI / 2 + angle);
    } else {
      ellipse(0, 0, 60);
    }
    if (buttonTimes[i] >= 90) {
      buttonPreare[i] = 1;
    }
    strokeWeight(1);
    fill(255);
    noStroke();
    textSize(width * 0.012);
    text(allKaomojis[i][0], 0, 60);
    pop();
  }
  if (allPrepare) {
    gameState = "play";
  }
}

function gaming() {
  background(0);
  textSize(width * 0.1);
  fill(255, 100);
  noStroke();
  textAlign(CENTER, CENTER);
  text("LEVEL:" + level, width / 2, height / 2);

  if (frameCount % int(40 / level) == 0 && kaomojis.length < kaomojiMaxNumber) {
    //每隔一定帧创建颜表情
    let r = int(random(rows));
    // 随机生成一个行数
    while (r == lastRow[0] || r == lastRow[1]) {
      // 如果随机的行数跟前两次生成的一样 就再次随机生成
      r = int(random(rows));
    }

    let y = r * interval;
    // 计算y坐标
    kaomojis.push(new Kaomoji(width, y + interval / 2));
    //更新最新生成的行数
    lastRow[0] = lastRow[1];
    lastRow[1] = r;
  } else if (kaomojis.length == kaomojiMaxNumber) {
    if (kaomojis[kaomojiMaxNumber - 1].x < 0) {
      gameState = "over";
      overTime = millis();
    }
  }
  for (let i = 0; i < kaomojis.length; i++) {
    kaomojis[i].display();
    kaomojis[i].update();
  }
 
}

function over() {
  background(0);

  for (let i = 0; i < 3; i++) {
    if (alphaList[i] < 255) {
      alphaList[i] += 5;
      break;
    }
  }

  for (let i = 0; i < 3; i++) {
    let x = map(i, -1, 3, 0, width);
    let y1 = height * 0.3;
    let y2 = height * 0.6;
    let y3 = height * 0.75;
    fill(255, alphaList[i]);
    textAlign(CENTER, CENTER);
    textSize(width * 0.02);
    text("Player " + (i + 1) + " answer:\n" + playerAnswers[i], x, y1);
    text("Correct answer:\n" + kaomojiTypes[i], x, y2);
    if (alphaList[i] > 240) {
      if (playerAnswers[i] == kaomojiTypes[i]) {
        text("YAY!", x, y3);
      } else {
        text("Ah OH >.<", x, y3);
      }
    }
  }
  if (millis() - overTime > 12000) {
    gameState = "start";
    initialization();
  }
}
class Kaomoji {
  constructor(x, y) {
    //初始位置
    this.x = x;
    this.y = y;
    this.kaomojiType = int(random(3));
    //累计各种表情出现的次数
    kaomojiTypes[this.kaomojiType] += 1;
    this.kaomoji = random(allKaomojis[this.kaomojiType]);
    this.vx = -3 * level;
    this.size = interval / 2;
  }
  display() {
    // 绘制字符
    textSize(this.size);
    textAlign(CENTER, CENTER);
    fill(255);
    text(this.kaomoji,this.x, this.y);
  }
  update() {
    // 移动1
    this.x += this.vx;
  }
}
