const ns = 'http://www.w3.org/2000/svg';
let root;
let prevTime;
let width, height;

const makeCircle = (x, y, r) => {
  const circle = document.createElementNS(ns, 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', r);
  root.appendChild(circle);
  return circle;
};

const makeLine = (x1, y1, x2, y2) => {
  const line = document.createElementNS(ns, 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', 'black');
  root.appendChild(line);
  return line;
};

// Makes the root svg fill the whole screen
const handleResize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  root.setAttribute('width', width);
  root.setAttribute('height', height);
};

// Initializes the root svg element that all others will be children of
const init = () => {
  root = document.createElementNS(ns, 'svg');
  handleResize(); // make it fill screen
  document.body.appendChild(root);
};

// Animation loop that gets called every frame
const tick = () => {
  if (typeof onTick === 'function') {
    const deltaTime = (performance.now() - prevTime) / 1000;
    onTick(deltaTime);
  }
  prevTime = performance.now();
  window.requestAnimationFrame(tick);
};

// Set up listeners
window.addEventListener('resize', handleResize);

init();

// Start the game loop.
prevTime = performance.now();
tick();
