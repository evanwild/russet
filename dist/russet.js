var Russet = (function () {
    function Russet() {
        var _this = this;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.keysDown = new Set();
        this.mouse = { x: 0, y: 0 };
        this.handleResize();
        window.addEventListener('resize', function () { return _this.handleResize(); });
        window.addEventListener('mousemove', function (e) { return _this.handleMousemove(e); });
        window.addEventListener('keydown', function (e) { return _this.handleKeydown(e); });
        window.addEventListener('keyup', function (e) { return _this.handleKeyup(e); });
        document.body.style.margin = '0px';
        document.body.appendChild(this.canvas);
    }
    Russet.prototype.gameLoop = function () {
        var _this = this;
        if (this.beforeDraw) {
            var deltaTime = (Date.now() - this.prevTime) / 1000;
            this.beforeDraw(deltaTime);
        }
        var scale = Math.max(this.width / this.camera.width, this.height / this.camera.height);
        if (this.scene) {
            this.context.fillStyle = this.scene.color;
            this.context.fillRect(0, 0, this.width, this.height);
            this.context.save();
            this.context.translate(this.width / 2, this.height / 2);
            this.context.scale(scale, scale);
            this.context.translate(-this.camera.position.x, -this.camera.position.y);
            for (var _i = 0, _a = this.scene.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.draw(this.context);
            }
            this.context.restore();
        }
        this.prevTime = Date.now();
        window.requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Russet.prototype.startGameLoop = function (beforeDraw) {
        this.beforeDraw = beforeDraw;
        this.prevTime = Date.now();
        this.gameLoop();
    };
    Russet.prototype.handleResize = function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;
        this.canvas.style.width = "".concat(this.width, "px");
        this.canvas.style.height = "".concat(this.height, "px");
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    Russet.prototype.handleMousemove = function (event) {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
    };
    Russet.prototype.handleKeydown = function (event) {
        if (event.repeat) {
            return;
        }
        this.keysDown.add(event.code);
    };
    Russet.prototype.handleKeyup = function (event) {
        this.keysDown.delete(event.code);
    };
    Russet.prototype.isKeyDown = function (code) {
        this.keysDown.has(code);
    };
    return Russet;
}());
var Scene = (function () {
    function Scene(width, height, color) {
        if (color === void 0) { color = 'black'; }
        this.width = width;
        this.height = height;
        this.color = color;
        this.children = [];
    }
    Object.defineProperty(Scene.prototype, "center", {
        get: function () {
            return {
                x: this.width / 2,
                y: this.height / 2,
            };
        },
        enumerable: false,
        configurable: true
    });
    Scene.prototype.makeGroup = function () {
        var group = new Group();
        this.children.push(group);
        return group;
    };
    Scene.prototype.makeRect = function (position, width, height) {
        var rect = new Rect(position, width, height);
        this.children.push(rect);
        return rect;
    };
    Scene.prototype.makeCircle = function (position, radius) {
        var circle = new Circle(position, radius);
        this.children.push(circle);
        return circle;
    };
    Scene.prototype.makeLine = function (x1, y1, x2, y2) {
        var line = new Line(x1, y1, x2, y2);
        this.children.push(line);
        return line;
    };
    return Scene;
}());
var Camera = (function () {
    function Camera(width, height, position) {
        this.width = width;
        this.height = height;
        this.position = position;
    }
    return Camera;
}());
var Group = (function () {
    function Group() {
        this.children = [];
        this.position = { x: 0, y: 0 };
        this.anchor = { x: 0, y: 0 };
        this.scale = 1;
        this.rotation = 0;
    }
    Group.prototype.draw = function (context) {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation);
        context.scale(this.scale, this.scale);
        context.translate(-this.anchor.x, -this.anchor.y);
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(context);
        }
        context.restore();
    };
    Group.prototype.makeGroup = function () {
        var group = new Group();
        this.children.push(group);
        return group;
    };
    Group.prototype.makeRect = function (position, width, height) {
        var rect = new Rect(position, width, height);
        this.children.push(rect);
        return rect;
    };
    Group.prototype.makeCircle = function (position, radius) {
        var circle = new Circle(position, radius);
        this.children.push(circle);
        return circle;
    };
    Group.prototype.makeLine = function (x1, y1, x2, y2) {
        var line = new Line(x1, y1, x2, y2);
        this.children.push(line);
        return line;
    };
    return Group;
}());
var Rect = (function () {
    function Rect(position, width, height) {
        this.position = position;
        this.anchor = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.rotation = 0;
        this.fill = 'white';
        this.stroke = 'white';
        this.lineWidth = 0;
    }
    Rect.prototype.draw = function (context) {
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
    };
    return Rect;
}());
var Circle = (function () {
    function Circle(position, radius) {
        this.position = position;
        this.anchor = { x: 0, y: 0 };
        this.radius = radius;
        this.rotation = 0;
        this.fill = 'white';
        this.stroke = 'white';
        this.lineWidth = 0;
    }
    Circle.prototype.draw = function (context) {
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
    };
    return Circle;
}());
var Line = (function () {
    function Line(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.anchor = { x: 0, y: 0 };
        this.rotation = 0;
        this.stroke = 'white';
        this.lineWidth = 0;
    }
    Line.prototype.draw = function (context) {
        context.save();
        context.translate(this.x1, this.y1);
        context.rotate(this.rotation);
        context.beginPath();
        context.moveTo(-this.anchor.x, -this.anchor.y);
        context.lineTo(this.x2 - this.x1 - this.anchor.x, this.y2 - this.y1 - this.anchor.y);
        context.strokeStyle = this.stroke;
        context.lineWidth = this.lineWidth;
        context.stroke();
        context.restore();
    };
    return Line;
}());
