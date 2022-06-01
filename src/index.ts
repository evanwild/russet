interface Point {
  x: number;
  y: number;
}

type Child = Group | Rect | Circle | Line;

class Russet {
  scene: Scene;
  camera: Camera;
  width: number;
  height: number;
  mouse: Point;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private prevTime: number;
  private beforeDraw: (deltaTime: number) => void;
  private keysDown: Set<string>;

  /*
   * Initializes Russet's internal variables, sets up event listeners, and
   * appends the canvas to the DOM
   */
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.keysDown = new Set();
    this.mouse = { x: 0, y: 0 };

    this.handleResize(); // Sets the inital canvas size

    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('mousemove', (e) => this.handleMousemove(e));
    window.addEventListener('keydown', (e) => this.handleKeydown(e));
    window.addEventListener('keyup', (e) => this.handleKeyup(e));

    document.body.style.margin = '0px';
    document.body.appendChild(this.canvas);
  }

  /*
   * Draws every child in the scene, every frame
   */
  gameLoop() {
    // Call the user's function if it is specified
    if (this.beforeDraw) {
      const deltaTime = (Date.now() - this.prevTime) / 1000;
      this.beforeDraw(deltaTime);
    }

    // Figure out how zoomed in the browser is relative to the camera
    const scale = Math.max(
      this.width / this.camera.width,
      this.height / this.camera.height
    );

    if (this.scene) {
      this.context.fillStyle = this.scene.color;
      this.context.fillRect(0, 0, this.width, this.height);

      this.context.save();
      this.context.translate(this.width / 2, this.height / 2);
      this.context.scale(scale, scale);
      this.context.translate(-this.camera.position.x, -this.camera.position.y);

      for (let child of this.scene.children) {
        child.draw(this.context);
      }

      this.context.restore();
    }

    this.prevTime = Date.now();
    window.requestAnimationFrame(() => this.gameLoop());
  }

  /*
   * Begins the animation loop with an optional function argument, where the
   * user can put their own code to be called every frame before we draw
   */
  startGameLoop(beforeDraw: (deltaTime: number) => void) {
    this.beforeDraw = beforeDraw;
    this.prevTime = Date.now();
    this.gameLoop();
  }

  /*
   * Makes the canvas take up the full screen, and updates Russet's internal
   * width/height variables
   */
  private handleResize() {
    // Update internal width and height
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Update the actual size of the canvas (handling high dpi screens)
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  /*
   * Updates Russet's internal mouse position
   */
  private handleMousemove(event: MouseEvent) {
    this.mouse.x = event.x;
    this.mouse.y = event.y;
  }

  /*
   * Updates Russet's internal set of currently pressed keys
   */
  private handleKeydown(event: KeyboardEvent) {
    if (event.repeat) {
      return;
    }
    this.keysDown.add(event.code);
  }

  /*
   * Updates Russet's internal set of currently pressed keys
   */
  private handleKeyup(event: KeyboardEvent) {
    this.keysDown.delete(event.code);
  }

  /*
   * Returns true if the key with the specified code is currently pressed
   */
  isKeyDown(code: string) {
    return this.keysDown.has(code);
  }
}

class Scene {
  width: number;
  height: number;
  color: string;
  children: Child[];

  constructor(width: number, height: number, color: string = 'black') {
    this.width = width;
    this.height = height;
    this.color = color;
    this.children = [];
  }

  /*
   * Returns the position at the center of the scene
   */
  get center(): Point {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  /*
   * Makes a new empty group and appends it to the scene
   */
  makeGroup(): Group {
    const group = new Group();
    this.children.push(group);
    return group;
  }

  /*
   * Makes a new rectangle and appends it to the scene
   */
  makeRect(position: Point, width: number, height: number): Rect {
    const rect = new Rect(position, width, height);
    this.children.push(rect);
    return rect;
  }

  /*
   * Makes a new circle and appends it to the scene
   */
  makeCircle(position: Point, radius: number): Circle {
    const circle = new Circle(position, radius);
    this.children.push(circle);
    return circle;
  }

  /*
   * Makes a new line and appends it to the scene
   */
  makeLine(x1: number, y1: number, x2: number, y2: number): Line {
    const line = new Line(x1, y1, x2, y2);
    this.children.push(line);
    return line;
  }
}

class Camera {
  position: Point;
  width: number;
  height: number;

  constructor(position: Point, width: number, height: number) {
    this.position = position;
    this.width = width;
    this.height = height;
  }
}

class Group {
  children: Child[];
  position: Point;
  anchor: Point;
  scale: number;
  rotation: number;

  constructor() {
    this.children = [];
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
  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    context.scale(this.scale, this.scale);
    context.translate(-this.anchor.x, -this.anchor.y);

    for (let child of this.children) {
      child.draw(context);
    }

    context.restore();
  }

  /*
   * Makes a new empty group and appends it to this group
   */
  makeGroup(): Group {
    const group = new Group();
    this.children.push(group);
    return group;
  }

  /*
   * Makes a new rectangle and appends it to this group
   */
  makeRect(position: Point, width: number, height: number): Rect {
    const rect = new Rect(position, width, height);
    this.children.push(rect);
    return rect;
  }

  /*
   * Makes a new circle and appends it to this group
   */
  makeCircle(position: Point, radius: number): Circle {
    const circle = new Circle(position, radius);
    this.children.push(circle);
    return circle;
  }

  /*
   * Makes a new line and appends it to this group
   */
  makeLine(x1: number, y1: number, x2: number, y2: number): Line {
    const line = new Line(x1, y1, x2, y2);
    this.children.push(line);
    return line;
  }
}

class Rect {
  position: Point;
  anchor: Point;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  lineWidth: number;

  constructor(position: Point, width: number, height: number) {
    this.position = position;
    this.anchor = { x: 0, y: 0 };
    this.width = width;
    this.height = height;
    this.rotation = 0;
    this.fill = 'white';
    this.stroke = 'white';
    this.lineWidth = 0;
  }

  /*
   * Renders this rectangle onto the canvas
   */
  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);

    context.beginPath();
    context.rect(-this.anchor.x, -this.anchor.y, this.width, this.height);

    if (this.fill) {
      context.fillStyle = this.fill;
      context.fill();
    }
    if (this.stroke && this.lineWidth) {
      context.strokeStyle = this.stroke;
      context.lineWidth = this.lineWidth;
      context.stroke();
    }

    context.restore();
  }
}

class Circle {
  position: Point;
  anchor: Point;
  radius: number;
  rotation: number;
  fill: string;
  stroke: string;
  lineWidth: number;

  constructor(position: Point, radius: number) {
    this.position = position;
    this.anchor = { x: 0, y: 0 };
    this.radius = radius;
    this.rotation = 0;
    this.fill = 'white';
    this.stroke = 'white';
    this.lineWidth = 0;
  }

  /*
   * Renders this circle onto the canvas
   */
  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);

    context.beginPath();
    context.arc(-this.anchor.x, -this.anchor.y, this.radius, 0, 2 * Math.PI);

    if (this.fill) {
      context.fillStyle = this.fill;
      context.fill();
    }
    if (this.stroke && this.lineWidth) {
      context.strokeStyle = this.stroke;
      context.lineWidth = this.lineWidth;
      context.stroke();
    }

    context.restore();
  }
}

class Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  anchor: Point;
  rotation: number;
  stroke: string;
  lineWidth: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
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
  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x1, this.y1);
    context.rotate(this.rotation);

    context.beginPath();
    context.moveTo(-this.anchor.x, -this.anchor.y);
    context.lineTo(
      this.x2 - this.x1 - this.anchor.x,
      this.y2 - this.y1 - this.anchor.y
    );
    context.strokeStyle = this.stroke;
    context.lineWidth = this.lineWidth;
    context.stroke();

    context.restore();
  }
}
