let backgroundColor = ['rgb(215, 236, 220)', 'rgb(233, 233, 233)', 'rgb(205, 222, 251)']
let symbols = ['𓅪','✴︎','☆']

async function setup() {
  p5.fillGradient.setup();
  p5grain.setup();
}

const n = 100;        // number of shapes
const turns = 4.1;    // how many times it winds around
const rInner = 0.05;  // radius at the center (fraction of outer)
const curve = 1.2;    // 1 = even spacing, >1 = tighter toward the center
const R = Math.min(innerWidth, innerHeight) * 0.42; // outer radius in px

const spiral = document.querySelector(".spiral");

for (let i = 0; i < n; i++) {
  const t = i / (n - 1);                           // 0 = outside, 1 = center
  const angle = t * turns * Math.PI * 2;
  const r = R * (rInner + (1 - rInner) * (1 - t) ** curve);
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  const size = 1 - 0.7 * t;                        // shapes shrink inward

  const dot = document.createElement("div");
  dot.className = "dot";
  dot.style.transform = `translate(${x}px, ${y}px) scale(${size})`;
  spiral.append(dot);
}