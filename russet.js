const ns = 'http://www.w3.org/2000/svg';

const Russet = {
  root: null,
  camera: null,
  world: null,
  children: [],
  width: 0,
  height: 0,
  prevTime: 0,

  /*
   * Creates the root svg element that all children will be contained in and
   * appends it to the DOM
   */
  init: function () {
    this.root = document.createElementNS(ns, 'svg');
    this.handleResize();
    document.body.appendChild(this.root);

    // Set up all the listeners
    window.addEventListener('resize', () => this.handleResize());
  },

  /*
   * Starts the animation loop
   *
   */
  startTicking: function () {
    this.prevTime = performance.now();
    this.tick();
  },

  /*
   * Makes the root svg element take up the full screen, and updates internal
   * width and height variables
   *
   */
  handleResize: function () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.root.setAttribute('width', this.width);
    this.root.setAttribute('height', this.height);
  },

  /*
   * An animation loop that is called once every frame, so functionality can be
   * added with the "onTick" function
   */
  tick: function () {
    // Call "onTick" if the user has defined it
    if (typeof onTick === 'function') {
      const deltaTime = (performance.now() - this.prevTime) / 1000;
      onTick(deltaTime);
    }
    this.prevTime = performance.now();
    window.requestAnimationFrame(() => this.tick());
  },

  /*
   * Creates a circle element at a given x, y, and with a given radius, and
   * appends it to the root svg element
   */
  makeCircle: function (x, y, r) {
    const circle = new Circle(x, y, r);
    this.root.appendChild(circle.elem);
    return circle;
  },

  /*
   * Creates a line element going from point (x1, y1) to point (x2, y2), and
   * appends it to the root svg element
   */
  makeLine: function (x1, y1, x2, y2) {
    const line = new Line(x1, y1, x2, y2);
    this.root.appendChild(line.elem);
    return line;
  },

  /*
   * Sets the active world
   *
   */
  setWorld: function (world) {
    this.world = world;
    this.root.style.backgroundColor = world.color;
  },

  /*
   * Sets the active camera
   *
   */
  setCamera: function (camera) {
    this.camera = camera;
  },
};

class World {
  constructor(width, height, color = 'white') {
    this.width = width;
    this.height = height;
    this.color = color;
  }
}

class Camera {
  constructor(x, y, maxWidth, maxHeight) {
    this.x = x;
    this.y = y;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.elem = document.createElementNS(ns, 'circle');
    this.elem.setAttribute('cx', x);
    this.elem.setAttribute('cy', y);
    this.elem.setAttribute('r', r);
  }

  setX(newX) {
    this.x = newX;
    this.elem.setAttribute('cx', newX);
  }

  setY(newY) {
    this.y = newY;
    this.elem.setAttribute('cy', newY);
  }

  setR(newR) {
    this.r = newR;
    this.elem.setAttribute('r', newR);
  }
}

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.elem = document.createElementNS(ns, 'line');
    this.elem.setAttribute('x1', x1);
    this.elem.setAttribute('y1', y1);
    this.elem.setAttribute('x2', x2);
    this.elem.setAttribute('y2', y2);
    this.elem.setAttribute('stroke', 'black');
  }
}
