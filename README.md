# russet

Russet is a lightweight JavaScript library for building 2D web games.

It's an abstraction of the HTML Canvas API full of features to make your life easier:

- Create scenes and place persistent shapes/objects in them
- Make cameras that can move around and zoom in/out
- Translate, scale, and rotate groups or individual shapes
- Automatic crisp graphics on high-DPI displays
- Render everything correctly when the browser is resized
- Capture mouse and keyboard input

## Installation

Download either `russet.js` (8.3kb) or `russet.min.js` (4.8kb) from the `/dist` folder. Include the script in your HTML file before your game scripts:

```html
<script src="./russet.js"></script>
```

## Example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Russet Example</title>
    <script src="./russet.js"></script>
  </head>
  <body>
    <script>
      // Initialize the library
      const russet = new Russet();

      // Set the active scene to be 1000x1000 units with a black background
      const scene = new Scene(1000, 1000, 'black');
      russet.scene = scene;

      // Set the active camera to one at the center of the scene, which can
      // see 800 units wide and 600 units high
      const camera = new Camera(scene.center, 800, 600);
      russet.camera = camera;

      // Place a circle at the center of the scene with radius 32 units
      const circle = scene.makeCircle(scene.center, 32);
      circle.fill = 'red';

      // Define a function which moves the circle to the left or right 300
      // units every second if the arrow keys are pressed
      const update = (deltaTime) => {
        if (russet.isKeyDown('ArrowLeft')) {
          circle.position.x -= 300 * deltaTime;
        }
        if (russet.isKeyDown('ArrowRight')) {
          circle.position.x += 300 * deltaTime;
        }
      };

      // Start the game loop, calling our update function before every draw
      russet.startGameLoop(update);
    </script>
  </body>
</html>
```
