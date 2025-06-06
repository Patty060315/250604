/*
----- Coding Tutorial by Patt Vira ----- 
Name: Interactive Bridge w Bouncing Balls (matter.js + ml5.js)
Video Tutorial: https://youtu.be/K7b5MEhPCuo

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

// ml5.js 
let handPose;
let video;
let hands = [];

const THUMB_TIP = 4;
const INDEX_FINGER_TIP = 8;

// Matter.js 
const {Engine, Body, Bodies, Composite, Composites, Constraint, Vector} = Matter;
let engine;
let bridge; let num = 10; let radius = 10; let length = 25;
let circles = [];

let colorPalette = ["#f7e1d7", "#9d8189", "#8d99ae", "#62b6de", "#f589a3", "#81b29a", "#738290", "#cb997e"]; 

function preload() {
  // Load the handPose model
  handPose = ml5.handPose({maxHands: 1, flipped: true});
}


function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO, {flipped: true});
  video.size(640, 480);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  
  
  engine = Engine.create();
  bridge = new Bridge(num, radius, length);
}

function draw() {
  background(220);

  Engine.update(engine);
  strokeWeight(2);
  stroke(0);

  // 先畫攝影機畫面
  image(video, 0, 0, width, height);

  // 再顯示標題，才不會被蓋掉
  textAlign(CENTER, TOP);
  textSize(32);
  fill(50, 50, 150);
  noStroke();
  text("淡江教育科技系", width / 2, 10);

  if (random() < 0.1) {
    circles.push(new Circle());
  }

  for (let i=circles.length-1; i>=0; i--) {
    circles[i].checkDone();
    circles[i].display();

    if (circles[i].done) {
      circles[i].removeCircle();
      circles.splice(i, 1);
    }
  }

  if (hands.length > 0) {
    let thumb = hands[0].keypoints[THUMB_TIP];
    let index = hands[0].keypoints[INDEX_FINGER_TIP];
    fill(0, 255, 0);
    noStroke();
    circle(thumb.x, thumb.y, 10);
    circle(index.x, index.y, 10);

    bridge.bodies[0].position.x = thumb.x;
    bridge.bodies[0].position.y = thumb.y;
    bridge.bodies[bridge.bodies.length-1].position.x = index.x;
    bridge.bodies[bridge.bodies.length-1].position.y = index.y;
    bridge.display();
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}
