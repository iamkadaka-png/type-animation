

let cols = 280;
let rows = 280;
let w, h;

// Sand
var num = 12340;
var noiseScale=100, noiseStrength=1;
var particles = [num];

// 폰트
let fontFrench;
let fontKorean;

// 단어 순서
let words = ["chatouiller", "간지럽다", "gratter", "간지럽다"];
let fonts = [];
// 글자 크기 
let sizes = [60, 120, 80, 166];

// 점 데이터
let pointsA = [];
let pointsB = [];

// 애니메이션 제어
let step = 0;        // 현재 단어 인덱스
let progress = 0;    // 0 ~ 1
let speed = 0.02;    // 변형 속도
let pg 
function preload() {
  fontFrench = loadFont("font/ABCStefan-Simple-Trial.otf");
  fontKorean = loadFont("font/BMKkubulim.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  background(0)
  w = width / cols;
  h = height / rows;

  fonts = [
    fontFrench, // chatouiller
    fontKorean, // 간지럽다
    fontFrench, // gratter
    fontKorean  // 간지럽다
  ];
  pg = createGraphics(width, height);
  pg.textAlign(CENTER, CENTER);
  
  // Make the sand
  for (let i=0; i<num; i++) {
    var loc = createVector(random(width*1.2), random(height), 2);
    var angle = 0; //any value to initialize
    var dir = createVector(cos(angle), sin(angle));
    // var speed = random(0.5,2);
    var speed = random(10,map(mouseX,0,width,5,100));   // faster
    particles[i]= new Particle(loc, dir, speed);
  }

  updatePoints();
}

function draw() {
  // background(100, 125, 256);
  // 배경 색
  fill(38, 41, 106);
  rect(0,0, width, height);

  // Particles 
  for (let i=0; i<particles.length; i++) {
    particles[i].run();
  }

  // progress 증가
  progress += speed;

  // progress가 1 이상이면 바로 다음 단어로 이동
  if (progress >= 1) {
    progress = 0;
    step = (step + 1) % words.length;
    updatePoints();
  }
  console.log(progress)
  let easedProgress = map( cos(progress * PI), 1, -1, 0, 1)
  // 속도 이름 변경
  easedProgress = easeInOutBack(progress)

  // 글자색
  fill(180, 220, 40);

  for (let i = 0; i < pointsA.length; i++) {
    // lerp에 easeInOutElastic 사용
    let x = lerp(pointsA[i][0], pointsB[i][0], easedProgress);
    let y = lerp(pointsA[i][1], pointsB[i][1], easedProgress);
    // 글자 점 크기
    ellipse(x * w, y * h, 3, 3);
    // stroke(255, 120, 0)
    // line(x * w, y * h, x*w+20, y*h)
    // noStroke()
  }
}

// 글자를 점 배열로 변환
function getTextPoints(word, font, size) {
 
  pg.background(255);
    pg.textFont(font, size);
  pg.text(word, pg.width / 2, pg.height / 2);

  let pts = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let c = pg.get(x * w, y * h);
      if (brightness(c) < 50) {
        pts.push([x, y]);
      }
    }
  }
  return pts;
}

// 현재 단어와 다음 단어 점 계산
function updatePoints() {
  let nextStep = (step + 1) % words.length;

  pointsA = getTextPoints(words[step], fonts[step], sizes[step]);
  pointsB = getTextPoints(words[nextStep], fonts[nextStep], sizes[nextStep]);

  // 점 개수 맞추기
  if (pointsA.length < pointsB.length) {
    while (pointsA.length < pointsB.length) {
      pointsA.push(random(pointsA));
    }
  } else {
    while (pointsB.length < pointsA.length) {
      pointsB.push(random(pointsB));
    }
  }
}

// 속도 다양성
function easeInOutBack(x) {
const c1 = 1.70158;
const c2 = c1 * 1.525;

return x < 0.5
  ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
  : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}


class Particle{
  constructor(_loc,_dir,_speed){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
  	// var col;
  }
  run() {
    this.move();
    this.checkEdges();
    this.update();
  }
  move(){
    let angle=noise(this.loc.x/noiseScale, this.loc.y/noiseScale, frameCount/noiseScale)*TWO_PI*noiseStrength; //0-2PI
    this.dir.x = sin(angle);
    this.dir.y = tan(angle);
    var vel = this.dir.copy();
    var d = 22;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }
  checkEdges(){

    if (this.loc.x<0 || this.loc.x>width || this.loc.y<0 || this.loc.y>height) {    
      this.loc.x = random(width*10);
      this.loc.y = random(height);
    }
  }
  update(){
    // 모래색 
    fill(205,102,125);
    ellipse(this.loc.x, this.loc.y, this.loc.z);
  }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  pg.resize(width, height);

    w = width / cols;
  h = height / rows;
}




