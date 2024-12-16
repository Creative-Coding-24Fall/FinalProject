const positiveEmojis = ["😀", "😄", "🥳", "😍", "😊", "😌", "🤩", "😋", "😎", "👍"];
const negativeEmojis = ["😞", "😡", "😢", "😭", "😰", "😖", "😩",  "🤬", "🙃"];
const neutralEmojis = ["😐", "😑", "😶", "🤔", "😬", "😴", "🤷", "🤨"];
let allEmojis=[
  positiveEmojis,negativeEmojis,neutralEmojis
]
let emojis=[]
function setup() {
  createCanvas(windowWidth,windowHeight);
}

function draw() {
  background(0);
  if(frameCount%10==0){
    emojis.push(new Emotion(width,random(height)))
  }
  for(let i=0;i<emojis.length;i++){
    emojis[i].display()
    emojis[i].update()
  }
}
class Emotion
{
  Emotion(x,y){
    this.x=x
    this.y=y
    this.emojiType=int(random(3))
    this.emoji=random(allEmojis[this.emojiType])
    this.velx=-3
    
  }
display(){
  push()
  translate(this.x,this.y)
  textSize(30)
  textAlign(CENTER,CENTER)
  text(this.emoji,0,0)
  pop()
}
update(){
this.x+=this.velx

}

}