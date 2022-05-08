const Russet = {
  canvas: null,
  context: null,
  camera: null,
  world: null,
  width: 0,
  height: 0,
  prevTime: 0,

  /*
   * Initializes everything by appending a canvas that children will be drawn
   * in to the DOM, and starting the animaton loop
   */
  init: function () {
    document.body.style.margin = '0px';

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.handleResize(); // Set initial size
    document.body.appendChild(this.canvas);

    // Set up all the listeners
    window.addEventListener('resize', () => this.handleResize());

    // Start the animation loop
    this.tick();
  },

  /*
   * Makes the canvas element take up the full screen, and updates internal
   * width and height variables
   */
  handleResize: function () {
    // Update internal width/height variables
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Update the actual size of the canvas (handling high dpi screens)
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.context.scale(dpr, dpr);
  },

  /*
   * An animation loop that is called once every frame, with functionality that
   *  can be added to by the user with the "onTick" function
   */
  tick: function () {
    if (!this.world) {
      window.requestAnimationFrame(() => this.tick());
      return;
    }

    if (!this.camera) {
      window.requestAnimationFrame(() => this.tick());
      return;
    }

    // Call "onTick" if the user has defined it
    if (typeof onTick === 'function') {
      const deltaTime = (performance.now() - this.prevTime) / 1000;
      onTick(deltaTime);
    }

    // Clear the canvas
    this.context.fillStyle = this.world.color;
    this.context.fillRect(0, 0, this.width, this.height);

    // Draw all the children in the world
    const scale = Math.max(
      this.width / this.camera.maxWidth,
      this.height / this.camera.maxHeight
    );

    this.world.children.forEach((child) => {
      const classType = child.constructor.name;

      if (classType === 'Rect') {
        this.drawRect(child, scale);
      } else if (classType === 'Circle') {
        this.drawCircle(child, scale);
      } else if (classType === 'Line') {
        this.drawLine(child, scale);
      }
    });

    this.prevTime = performance.now();
    window.requestAnimationFrame(() => this.tick());
  },

  /*
   * Draws a rectangle onto the canvas, taking into account the camera position
   * and the size of the browser window
   */
  drawRect: function (rect, scale) {
    const x = (rect.x - this.camera.x) * scale + this.width / 2;
    const y = (rect.y - this.camera.y) * scale + this.height / 2;
    const width = rect.width * scale;
    const height = rect.height * scale;

    this.context.beginPath();
    this.context.rect(x, y, width, height);
    this.context.fillStyle = rect.fill;
    this.context.fill();
  },

  /*
   * Draws a circle onto the canvas, taking into account the camera position
   * and the size of the browser window
   */
  drawCircle: function (circle, scale) {
    const x = (circle.x - this.camera.x) * scale + this.width / 2;
    const y = (circle.y - this.camera.y) * scale + this.height / 2;
    const r = circle.r * scale;

    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    this.context.fillStyle = circle.fill;
    this.context.fill();
  },

  /*
   * Draws a line onto the canvas, taking into account the camera position and
   * the size of the browser window
   */
  drawLine: function (line, scale) {
    const x1 = (line.x1 - this.camera.x) * scale + this.width / 2;
    const y1 = (line.y1 - this.camera.y) * scale + this.height / 2;
    const x2 = (line.x2 - this.camera.x) * scale + this.width / 2;
    const y2 = (line.y2 - this.camera.y) * scale + this.height / 2;

    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  },

  /*
   * Sets the active world that is being drawn on the canvas
   */
  setWorld: function (world) {
    this.world = world;
  },

  /*
   * Sets the active camera so we know where stuff should be drawn
   */
  setCamera: function (camera) {
    this.camera = camera;
  },
};

class World {
  constructor(width, height, color = 'black') {
    this.width = width;
    this.height = height;
    this.color = color;
    this.children = [];
  }

  /*
   * Creates a rectangle element at point (x, y) and with a given width/height,
   * and appends it to the world's children
   */
  makeRect(x, y, width, height) {
    const rect = new Rect(x, y, width, height);
    this.children.push(rect);
    return rect;
  }

  /*
   * Creates a circle element at point (x, y) and with a given radius, and
   * appends it to the world's children
   */
  makeCircle(x, y, r) {
    const circle = new Circle(x, y, r);
    this.children.push(circle);
    return circle;
  }

  /*
   * Creates a line element going from point (x1, y1) to point (x2, y2), and
   * appends it to the world's children
   */
  makeLine(x1, y1, x2, y2) {
    const line = new Line(x1, y1, x2, y2);
    this.children.push(line);
    return line;
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

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = 'black';
  }

  setFill(color) {
    this.fill = color;
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = 'black';
  }

  setFill(color) {
    this.fill = color;
  }
}

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}
