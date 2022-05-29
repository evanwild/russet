const russet = new Russet();

const scene = new Scene(2000, 2000, '#219ebc');
russet.scene = scene;

const camera = new Camera(800, 600, scene.center);
russet.camera = camera;

const rect = scene.makeRect(scene.center, 200, 200);
rect.anchor = { x: 100, y: 100 };
rect.fill = '#023047';

const circles = scene.makeGroup();
circles.position = scene.center;

const circle1 = circles.makeCircle({ x: -100, y: 0 }, 32);
circle1.fill = '#ffb703';

const circle2 = circles.makeCircle({ x: 100, y: 0 }, 32);
circle2.fill = '#fb8500';

let time = 0;
const update = (deltaTime) => {
  time += deltaTime;

  rect.width = 50 * Math.sin(time) + 200;
  rect.height = 50 * Math.sin(time) + 200;
  rect.anchor = { x: rect.width / 2, y: rect.height / 2 };

  circles.rotation = time;
};

russet.startGameLoop(update);
