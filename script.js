// variables for spiral
const n = 200;
const turns = 4.5;
const rInner = 0.02;
const curve = 1.2;
const symbolSize = 50;
const symbols = ["✴︎˚", "𓅪", " ོ", "⠙", "⠤", "⠷", "⟡", "⊹", "⋆.˚", "✦", "࿔"];
const imageNames = ['images/wrapped.jpg', 
  'images/baby.png', 
  'images/chair.jpg', 
  'images/sleeping.jpg', 
  'images/basket_nobg.png', 
  'images/plushie1.jpg', 
  'images/onatree1.jpg', 
  'images/flower.jpg', 
  'images/vetvisit.jpg', 
  'images/onatree_nobg.png'];

// make delay for spiral animationm
const sleep = ms => new Promise(res => setTimeout(res, ms));
const seed = new Date().getTime(); // storeItem and getItem

let img;
let images = []; // do not delete contents
let imagesCopy = [];
let hasResizedWindow = false;
// set scaling variables here

async function setup() {
  loadingAnimation();
  randomSeed(seed);
  createCanvas(windowWidth, windowHeight);
  p5grain.setup();

  // log images created
  for (let i = 0; i < imageNames.length; i++) {
    images[i] = await loadImage(imageNames[i]);
    images[i].name = imageNames[i];
  }
  imagesCopy = [...images];

  await drawSpiral(true, 30);
  noLoop();
}

function windowResized() {
  imagesCopy = [...images];
  // check if canvas was resized
  resizeCanvas(windowWidth, windowHeight);
  hasResizedWindow = true;
}

function writeText(imageName) {
  // map stories to images
  const storyIndex = imageNames.indexOf(imageName);
  document.getElementById("stories").innerHTML = stories[storyIndex];
}

function imageEffects(imgObject, imgX, imgY) {
  // add image effects
  imgObject.resize(100, 0);
  image(imgObject, imgX, imgY);
}

function draw() {
  imagesCopy = [...images];
  drawSpiral();
  applyMonochromaticGrain(16);
}

async function drawSpiral(isAnimating, delay) {
  randomSeed(seed);
  // for gradient background
  fillGradient('linear', {
  from: [0, 0],
  to: [0, height],
  steps: [
    color("rgb(100, 100, 100)"),
    color("rgb(255, 255, 255)"),
    color("rgb(100, 100, 100)")
  ]
  });

  noStroke();
  rect(0, 0, width, height);

  noStroke();

  //position the spiral
  translate(width / 2, height / 2);
  const fullCircleRadius = (Math.min(width, height) / 2 - symbolSize / 2) * 0.9;

  push();

  let prevX;
  let prevY;

  for (let i = 1; i < n; i++) {
    const selectedSymbol = random(symbols);
    const t = i / (n - 1);
    const angle = t * turns * TWO_PI;
    const r = fullCircleRadius * (rInner + (1 - rInner) * (1 - t) * curve);

    textSize(30);

    let currentX = Math.cos(angle) * r;
    let currentY = Math.sin(angle) * r;

    const bufferDistance = 15; // minimum distance between symbols
    if (!prevX || !prevY || dist(prevX, prevY, currentX, currentY) > bufferDistance) {
      
      fill(fillGradient('linear', {
      from: [0, 0],
      to: [0, height],
      steps: [
        color("rgb(185, 185, 185)"),
        color("rgb(255, 255, 255)"),
        color("rgb(185, 185, 185)")
      ]
      }));

      // draw random symbols
      text(selectedSymbol, currentX, currentY);
      // check if user resizes window, if they do stop the animation
      if (isAnimating && !hasResizedWindow) {
        await sleep(delay);
      }
      // draw random images selectively in spiral
      if ((i % 17 === 0 || i % 79 === 0) && imagesCopy.length > 0) {
        const randomIndex = floor(random(imagesCopy.length));
        img = imagesCopy[randomIndex];
        image(img, currentX, currentY, 120, 120, 0, 0, img.width, img.height, CONTAIN);
      
      // indicate img with #'s in circles
        noFill();
        strokeWeight(1);
        stroke('black');
        circle(currentX - 15, currentY + 5, 20);
        noStroke();
        fill('black');
        textSize(18);
      // # corresponds to order of story
        text(imageNames.indexOf(imagesCopy[randomIndex].name), currentX - 20, currentY + 11);

      fill(fillGradient('linear', {
      from: [0, 0],
      to: [0, height],
      steps: [
        color("rgb(185, 185, 185)"),
        color("rgb(255, 255, 255)"),
        color("rgb(185, 185, 185)")
      ]
      }));

      // create invisible box above images
        const box = createDiv('');
        box.id(imagesCopy[randomIndex].name);
        box.position(currentX + width / 2, currentY + height / 2);
        box.size(100, 100);

        // clone imagesCopy array before splicing
        const someImageObject = imagesCopy[randomIndex].get();
        // hover over image, target image effects and write text
        box.mouseOver(() => {
          writeText(box.id());
          imageEffects(someImageObject, currentX, currentY);
        });

        // delete the image at the randomIndex
        imagesCopy.splice(randomIndex, 1);
      }

      prevX = currentX;
      prevY = currentY;
    }
  }

  pop();
}