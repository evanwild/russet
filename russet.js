const Russet = {
  _canvas: null,
  _ctx: null,
  scene: null,
  camera: null,
  width: 0,
  height: 0,
  _prevTime: 0,
  _keysDown: new Set(),
  mouse: { x: 0, y: 0 },
  _tickFunc: null,

  /*
   * Initializes Russet's internal variables, sets up event listeners, and
   * appends the canvas to the DOM
   */
  init() {
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');

    this._handleResize(); // Sets the inital canvas size

    window.addEventListener('resize', this._handleResize.bind(this));
    window.addEventListener('mousemove', this._handleMousemove.bind(this));
    document.addEventListener('keydown', this._handleKeydown.bind(this));
    document.addEventListener('keyup', this._handleKeyup.bind(this));

    document.body.style.margin = '0px';
    document.body.appendChild(this._canvas);
  },

  /*
   * Makes the canvas take up the full screen, and updates Russet's internal
   * width/height variables
   */
  _handleResize() {
    // Update internal width and height
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Update the actual size of the canvas (handling high dpi screens)
    this._canvas.width = this.width * window.devicePixelRatio;
    this._canvas.height = this.height * window.devicePixelRatio;

    this._canvas.style.width = `${this.width}px`;
    this._canvas.style.height = `${this.height}px`;

    this._ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  },

  /*
   * Updates Russet's internal mouse position
   */
  _handleMousemove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  },

  /*
   * Updates Russet's internal set of currently pressed keys
   */
  _handleKeydown(e) {
    if (e.repeat) return;
    this._keysDown.add(e.code);
  },

  /*
   * Updates Russet's internal set of currently pressed keys
   */
  _handleKeyup(e) {
    this._keysDown.delete(e.code);
  },

  /*
   * Returns true if the key with the specified code is currently pressed
   */
  keyDown(code) {
    return this._keysDown.has(code);
  },

  /*
   * Draws every child in the scene, every frame
   */
  _tick() {
    // Call the user's function if it is specified
    if (this._tickFunc) {
      const deltaTime = (performance.now() - this._prevTime) / 1000;
      this._tickFunc(deltaTime);
    }

    // Figure out how zoomed in the browser is relative to the camera
    const scale = Math.max(
      this.width / this.camera.width,
      this.height / this.camera.height
    );

    if (this.scene) {
      this._ctx.fillStyle = this.scene.background;
      this._ctx.fillRect(0, 0, this.width, this.height);

      this._ctx.save();
      this._ctx.translate(this.width / 2, this.height / 2);
      this._ctx.scale(scale, scale);
      this._ctx.translate(-this.camera.position.x, -this.camera.position.y);

      for (let child of this.scene.children) {
        child.draw(this._ctx);
      }

      this._ctx.restore();
    }

    this._prevTime = performance.now();
    window.requestAnimationFrame(this._tick.bind(this));
  },

  /*
   * Begins the animation loop with an optional function argument, where the
   * user can put their own code to be called every frame before we draw
   */
  startTicking(func) {
    this._tickFunc = func;
    this._prevTime = performance.now();
    this._tick();
  },
};

class Scene {
  constructor(width, height, background = 'black') {
    this.width = width;
    this.height = height;
    this.background = background;
    this.children = [];
  }

  /*
   * Returns the position at the center of the scene
   */
  get center() {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  /*
   * Makes a new empty group and appends it to the scene
   */
  makeGroup() {
    const group = new Group();
    this.children.push(group);
    return group;
  }

  /*
   * Makes a new rectangle and appends it to the scene
   */
  makeRect(position, width, height) {
    const rect = new Rect(position, width, height);
    this.children.push(rect);
    return rect;
  }

  /*
   * Makes a new circle and appends it to the scene
   */
  makeCircle(position, radius) {
    const circle = new Circle(position, radius);
    this.children.push(circle);
    return circle;
  }

  /*
   * Makes a new line and appends it to the scene
   */
  makeLine(x1, y1, x2, y2) {
    const line = new Line(x1, y1, x2, y2);
    this.children.push(line);
    return line;
  }
}

class Camera {
  constructor(position, width, height) {
    this.position = position;
    this.width = width;
    this.height = height;
  }
}

class Rect {
  constructor(position, width, height) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.anchor = { x: 0, y: 0 };
    this.rotation = 0;
    this.fill = 'white';
    this.stroke = 'white';
    this.lineWidth = 0;
  }

  /*
   * Renders this rectangle onto the canvas
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    ctx.beginPath();
    ctx.rect(-this.anchor.x, -this.anchor.y, this.width, this.height);
    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }
    if (this.stroke && this.lineWidth) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.lineWidth;
      ctx.stroke();
    }

    ctx.restore();
  }
}

class Circle {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;
    this.anchor = { x: 0, y: 0 };
    this.rotation = 0;
    this.fill = 'white';
    this.stroke = 'white';
    this.lineWidth = 0;
  }

  /*
   * Renders this circle onto the canvas
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);

    ctx.beginPath();
    ctx.arc(-this.anchor.x, -this.anchor.y, this.radius, 0, 2 * Math.PI);

    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }
    if (this.stroke && this.lineWidth) {
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.lineWidth;
      ctx.stroke();
    }

    ctx.restore();
  }
}

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.anchor = { x: 0, y: 0 };
    this.rotation = 0;
    this.stroke = 'white';
    this.lineWidth = 0;
  }

  /*
   * Renders this line onto the canvas
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x1, this.y1);
    ctx.rotate(this.rotation);

    ctx.beginPath();
    ctx.moveTo(-this.anchor.x, -this.anchor.y);
    ctx.lineTo(
      this.x2 - this.x1 - this.anchor.x,
      this.y2 - this.y1 - this.anchor.y
    );
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();

    ctx.restore();
  }
}

class Group {
  constructor(children = []) {
    this.children = children;
    this.position = { x: 0, y: 0 };
    this.anchor = { x: 0, y: 0 };
    this.scale = 1;
    this.rotation = 0;
  }

  /*
   * Renders a group onto the canvas. We can imagine all the children in the
   * scene as a tree, where translations/rotations/scales are accumulated
   * as we traverse down
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.anchor.x, -this.anchor.y);

    for (let child of this.children) {
      child.draw(ctx);
    }

    ctx.restore();
  }

  /*
   * Makes a new empty group and appends it to the scene
   */
  makeGroup() {
    const group = new Group();
    this.children.push(group);
    return group;
  }

  /*
   * Makes a new rectangle and appends it to the scene
   */
  makeRect(position, width, height) {
    const rect = new Rect(position, width, height);
    this.children.push(rect);
    return rect;
  }

  /*
   * Makes a new circle and appends it to the scene
   */
  makeCircle(position, radius) {
    const circle = new Circle(position, radius);
    this.children.push(circle);
    return circle;
  }

  /*
   * Makes a new line and appends it to the scene
   */
  makeLine(x1, y1, x2, y2) {
    const line = new Line(x1, y1, x2, y2);
    this.children.push(line);
    return line;
  }
}
