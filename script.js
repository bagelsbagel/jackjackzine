const n = 150;
const turns = 4.5;
const rInner = 0.02;
const curve = 1.2;
const dotSize = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  p5grain.setup();
  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function draw() {
  noStroke();
  fill(0);

  // fits inside the window: smaller side, minus room for the outer dot
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
}