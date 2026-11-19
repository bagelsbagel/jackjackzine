// variables for spiral
const n = 200;
const turns = 4.5;
const rInner = 0.02;
const curve = 1.2;
const symbolSize = 50;
const symbols = ["✴︎˚", "𓅪", " ོ", "⠙", "⠤", "⠷", "⟡", "⊹", "⋆.˚", "✦", "࿔"];
const imageNames = ['images/baby.png', 'images/basket_nobg.png', 'images/chair.jpg', 'images/flower.jpg', 'images/onatree_nobg.png', 'images/onatree1.jpg', 'images/plushie1.jpg', 'images/plushie2.jpg', 'images/sleeping.jpg', 'images/teaching.jpg', 'images/vetvisit.jpg', 'images/wrapped.jpg'];

const seed = new Date().getTime(); // storeItem and getItem

let spiralColor;
let img;
let images = []; // do not delete contents
let imagesCopy = [];

function pickColors() {
  // set background & text colors
  var bgColors = ["rgb(242, 242, 242)"];
  var textColors = ["rgb(48, 48, 48)"]; 
  var bgColor = random(bgColors);
  var textColor = random(textColors);
  // document.body.style.background = bgColor;
  // document.body.style.color = textColor;
  return textColor;
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  p5grain.setup();
  noLoop();

  spiralColor = pickColors();
  // log images created
  for (let i = 0; i < imageNames.length; i++) {
    images[i] = await loadImage(imageNames[i]);
  }
  imagesCopy = [...images];
}

function windowResized() {
  imagesCopy = [...images];
  resizeCanvas(windowWidth, windowHeight);
}

function writeText() {
  document.getElementById("stories").innerHTML = random(stories);
}

function draw() {
  fillGradient('linear', {
  from: [0, 0],
  to: [0, height],
  steps: [
    color("rgb(202, 202, 202)"),
    color("rgb(255, 255, 255)"),
    color("rgb(202, 202, 202)")
  ]
  })
  noStroke();
  rect(0, 0, width, height);

  fill("rgb(48, 48, 48)")

  randomSeed(seed);
  noStroke();
  fill(spiralColor);

  const fullCircleRadius = (Math.min(width, height) / 2 - symbolSize / 2) * 0.9;

  push();

  //position the spiral
  translate(width / 2, height / 2);
  let prevX;
  let prevY;

  for (let i = 0; i < n; i++) {
    const selectedSymbol = random(symbols);
    const t = i / (n - 1);
    const angle = t * turns * TWO_PI;
    const r = fullCircleRadius * (rInner + (1 - rInner) * (1 - t) * curve);

    textSize(30);

    let currentX = Math.cos(angle) * r;
    let currentY = Math.sin(angle) * r;

    const bufferDistance = 15; // minimum distance between symbols
    if (!prevX || !prevY || dist(prevX, prevY, currentX, currentY) > bufferDistance) {
      // draw random symbols
      text(selectedSymbol, currentX, currentY);
      // draw random images selectively in spiral
      if ((i % 17 === 0 || i % 25 === 0) && imagesCopy.length > 0) {
        const randomIndex = floor(random(imagesCopy.length));
        img = imagesCopy[randomIndex];
      // delete the image at the randomIndex
        imagesCopy.splice(randomIndex, 1);
        image(img, currentX, currentY, 100, 100, 0, 0, img.width, img.height, CONTAIN);

      // create invisible box above images
        const box = createDiv('');
        box.position(currentX + width / 2, currentY + height / 2);
        box.size(100, 100);
      // hover over image, writes text
        box.mouseOver(writeText);
      }

      prevX = currentX;
      prevY = currentY;
    }
  }

  pop();
  applyMonochromaticGrain(16);
}