// variables for spiral
const n = 200;
const turns = 4.5;
const rInner = 0.02;
const curve = 1.2;
const symbolSize = 50;
const symbols = ["✴︎˚", "𓅪", " ོ", "⠙", "⠤", "⠷", "⟡", "⊹", "⋆.˚", "✦", "࿔"];
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
  const fullCircleRadius = (Math.min(width, height) / 2 - symbolSize / 2) * 0.9;

  push();
  //position the spiral
  translate(width / 2, height / 2);
  let prevX;
  let prevY;
  for (let i = 0; i < n; i++) {
    var symbolsNum = Math.floor(Math.random() * symbols.length);
    var selectedSymbol = symbols[symbolsNum];
    const t = i / (n - 1);
    const angle = t * turns * TWO_PI;
    const r = fullCircleRadius * (rInner + (1 - rInner) * (1 - t) * curve);
    //interact with images to show text
    textSize(30);
    let nextX = Math.cos(angle) * r;
    let nextY = Math.sin(angle) * r;
    const bufferDistance = 15; // Minimum distance between symbols
    if (!prevX || !prevY || dist(prevX, prevY, nextX, nextY) > bufferDistance) {
      text(selectedSymbol, nextX, nextY);
      prevX = nextX;
      prevY = nextY;
    }
  }
  pop();
  applyMonochromaticGrain(16);
}