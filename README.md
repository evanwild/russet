# russet

Russet is a small JavaScript library to simplify making 2D games for the web.

It includes a lot of features to make your life easier, such as:

- Letting you create persistent worlds to place objects in
- Translating, scaling, and rotating groups or individual shapes
- Making cameras that can move around and zoom in/out
- Crisp graphics on high-DPI displays
- Scaling and translating shapes automatically when the browser is resized

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
      // Creates a canvas and starts the game loop
      Russet.init();

      // Sets the active world to be 1000x1000 units with a white background
      const world = new World(1000, 1000, 'white');
      Russet.setWorld(world);

      // Sets the active camera to one at the centre of the world, which can
      // see 160 units wide and 90 units high
      const camera = new Camera(500, 500, 160, 90);
      Russet.setCamera(camera);

      // Place a circle at the centre of the world with radius 32
      const circle = world.makeCircle(500, 500, 32);
    </script>
  </body>
</html>
```
