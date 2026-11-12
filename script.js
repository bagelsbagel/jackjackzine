// variables for spiral
const n = 150;
const turns = 4.5;
const rInner = 0.02;
const curve = 1.2;
const dotSize = 30;
const symbols = ["⋆✴︎˚", "𓄿", "𓅪", " ོ"]
let spiralColor;

function pickColors() {
  var bgColors = ["rgb(242, 242, 242)", "rgb(249, 255, 230)", "rgb(233, 247, 255)", "rgb(255, 255, 229)", "rgb(255, 245, 252)"];
  var textColors = ["rgb(48, 48, 48)", "rgb(99, 161, 23)", "rgb(40, 118, 163)", "rgb(203, 141, 55)", "rgb(217, 32, 183)"]; 
  var randNum = Math.floor(Math.random() * bgColors.length);
  var bgColor = bgColors[randNum];
  var textColor = textColors[randNum];
  document.body.style.background = bgColor;
  document.body.style.color = textColor;
  return textColors[randNum];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  p5grain.setup();
  noLoop();
  spiralColor = pickColors();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function draw() {
  noStroke();
  fill(spiralColor);

  //make the spiral
  const R = Math.min(width, height) / 2 - dotSize / 2;

  push();
  translate(width / 2, height / 2);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const angle = t * turns * TWO_PI;
    const r = R * (rInner + (1 - rInner) * (1 - t) ** curve);
    circle(Math.cos(angle) * r, Math.sin(angle) * r, dotSize * (1 - 0.7 * t));
  }
  pop();
  applyMonochromaticGrain(16);
}