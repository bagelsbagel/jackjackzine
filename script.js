// variables for spiral
const n = 200;
const turns = 4.5;
const rInner = 0.02;
const curve = 1.2;
const symbolSize = 50;
const symbols = ["✴︎˚", "𓅪", " ོ", "⠙", "⠤", "⠷", "⟡", "⊹", "⋆.˚", "✦", "࿔"];
const imageNames = [
  "images/wrapped.jpg",
  "images/baby.png",
  "images/chair.jpg",
  "images/sleeping.jpg",
  "images/basket_nobg.png",
  "images/plushie1.jpg",
  "images/onatree1.jpg",
  "images/flower.jpg",
  "images/onatree_nobg.png",
  "images/vetvisit.jpg",
];

// make delay for spiral animationm
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const seed = new Date().getTime(); // storeItem and getItem
const images = []; // do not delete contents
const imageScale = {}; // map of the image name to the image scale

let img;
let imagesCopy = [];
let hasResizedWindow = false;

async function setup() {
  loadingAnimation();
  randomSeed(seed);
  createCanvas(windowWidth, windowHeight);
  p5grain.setup();
  imageMode(CENTER);

  // log images created
  for (let i = 0; i < imageNames.length; i++) {
    images[i] = await loadImage(imageNames[i]);
    images[i].name = imageNames[i];
    imageScale[imageNames[i]] = {
      currentWidth: 120,
      targetWidth: 120,
    };
  }
  imagesCopy = [...images];

  await drawSpiral(true, 30);
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

function draw() {
  imagesCopy = [...images];
  drawSpiral();
  applyMonochromaticGrain(16);
}

async function drawSpiral(isAnimating, delay) {
  randomSeed(seed);

  // for gradient background
  fillGradient("linear", {
    from: [0, 0],
    to: [0, height],
    steps: [
      color("rgb(100, 100, 100)"),
      color("rgb(255, 255, 255)"),
      color("rgb(100, 100, 100)"),
    ],
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

    const currentX = Math.cos(angle) * r;
    const currentY = Math.sin(angle) * r;

    const bufferDistance = 15; // minimum distance between symbols
    if (
      !prevX ||
      !prevY ||
      dist(prevX, prevY, currentX, currentY) > bufferDistance
    ) {
      fill(
        fillGradient("linear", {
          from: [0, 0],
          to: [0, height],
          steps: [
            color("rgb(185, 185, 185)"),
            color("rgb(255, 255, 255)"),
            color("rgb(185, 185, 185)"),
          ],
        })
      );

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
        let { currentWidth, targetWidth } = imageScale[img.name];
      
        // update imgToDraw to img with gray filter when gray is true
        const state = imageScale[img.name];
        const imgToDraw = state.gray ? state.grayImg : img;

        // transition
        imageScale[img.name].currentWidth = lerp(currentWidth, targetWidth, 0.7);
        // draw image
        image(
          imgToDraw,
          currentX,
          currentY,
          imageScale[img.name].currentWidth,
          imageScale[img.name].currentWidth,
          0,
          0,
          imgToDraw.width,
          imgToDraw.height,
          CONTAIN
        );

        // add #'s in circles
        noFill();
        strokeWeight(1);
        stroke("black");
        circle(currentX - 75, currentY - 50, 20);
        noStroke();
        fill("black");
        textSize(18);

        // # corresponds to order of story
        text(
          imageNames.indexOf(imagesCopy[randomIndex].name),
          currentX - 80,
          currentY - 44
        );

        fill(
          fillGradient("linear", {
            from: [0, 0],
            to: [0, height],
            steps: [
              color("rgb(185, 185, 185)"),
              color("rgb(255, 255, 255)"),
              color("rgb(185, 185, 185)"),
            ],
          })
        );

        // create invisible box above images
        const box = createDiv("");

        // from the copy array, at some random index, get the name of the image
        // set the id of the box div to this specific name 
        box.id(imagesCopy[randomIndex].name);
        // account for centered image
        box.position(
          currentX + width / 2 - imageScale[img.name].currentWidth / 2, 
          currentY + height / 2 - imageScale[img.name].currentWidth / 2);
        // match box size to image size (even when growing)
        box.size(imageScale[img.name].currentWidth, imageScale[img.name].currentWidth);

        // upon hover
        box.mouseOver(() => {
          // write corresponding story to image
          writeText(box.id());
          const state = imageScale[box.id()];

          // gray variable is undefined until image hover
          if (!state.grayImg) {
              const original = images.find((img) => img.name === box.id());
              const grayImg = original.get();
              grayImg.filter(GRAY);        
              state.grayImg = grayImg;
            }
          
          // scale up the target image
          imageScale[box.id()] = {
            ...state,
            targetWidth: 160,
            gray: true,
          };
        });

        box.mouseOut(() => {     
          // when mouse stops hovering, transition back to default img size   
          imageScale[box.id()] = {
            ...imageScale[box.id()],
            targetWidth: 120,
          };
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