let mainCanvas = document.querySelector("#canvas");
let mainCtx = canvas.getContext("2d");

const FPS = 144;
const HEIGHT = 600;
const WIDTH = 1200;

let NO_LOOP = false;

let mouseX = WIDTH / 2;
let mouseY = HEIGHT / 2;

let translatedX = 0;
let translatedY = 0;

mainCanvas.requestPointerLock = mainCanvas.requestPointerLock || mainCanvas.mozRequestPointerLock;

mainCanvas.addEventListener("click", () => {
  mainCanvas.requestPointerLock();
});

function lockChangeAlert() {
  if (document.pointerLockElement === mainCanvas || document.mozPointerLockElement === mainCanvas) {
    document.addEventListener("mousemove", updatePosition);
  } else {
    document.removeEventListener("mousemove", updatePosition);
  }
}

function updatePosition(e) {
  mouseX += e.movementX;
  mouseY += e.movementY;
}

// Event Listeners
addEventListener("resize", () => {
  // Sets canvas' position according to the window
  setCanvasPosition(mainCanvas);
  // Resets the objects
  setup();
});

document.addEventListener("pointerlockchange", lockChangeAlert);
document.addEventListener("mozpointerlockchange", lockChangeAlert);

// addEventListener("mousemove", (e) => {
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// });

let pressedKeys = [];

addEventListener("keydown", (e) => {
  let key = e.key.toLocaleUpperCase();
  if (!pressedKeys.find((el) => el === key)) pressedKeys.push(key);
});

addEventListener("keyup", (e) => {
  let key = e.key.toLocaleUpperCase();
  pressedKeys = pressedKeys.filter((el) => el !== key);
});

canvas.onclick = function () {
  canvas.requestPointerLock();
};

function setCanvasPosition(inputCanvas) {
  inputCanvas.style.top = `${(innerHeight - inputCanvas.height) / 2}px`;
  inputCanvas.style.left = `${(innerWidth - inputCanvas.width) / 2}px`;
}

function setCanvasSize(inputCanvas, width, height) {
  inputCanvas.width = width;
  inputCanvas.height = height;
}

function Line(x0, y0, x1, y1) {
  mainCtx.beginPath();
  mainCtx.moveTo(x0, y0);
  mainCtx.lineTo(x1, y1);
  mainCtx.stroke();
}

function Ellipse(x, y, size1, size2) {
  mainCtx.beginPath();
  mainCtx.ellipse(x, y, size1 / 2, size2 / 2, 0, 0, 2 * Math.PI);
  mainCtx.fill();
}

function translate(x, y) {
  translatedX = x;
  translatedY = y;
  mainCtx.translate(x, y);
}

function background(color = "white") {
  mainCtx.fillStyle = color;
  mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
}

function fillRect(x, y, width, height) {
  mainCtx.fillRect(x, y, width, height);
}

function stroke(color = "white") {
  mainCtx.strokeStyle = color;
}

function strokeWeight(weight) {
  mainCtx.lineWidth = weight;
}

function fill(color = "white") {
  mainCtx.fillStyle = color;
}

function noLoop() {
  NO_LOOP = true;
}

// Animation Loop
function drawLoop() {
  setTimeout(() => {
    draw();
    mainCtx.translate(-translatedX, -translatedY);
    if (!NO_LOOP) {
      requestAnimationFrame(drawLoop); // Create an animation loop
    }
  }, 1000 / FPS);
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

let walls = [];
let borderSize = 10;
let wallSize = 5;
let rayAmount = 1000;
let fov = 40;
let sensitivity = 0.1;

let player;

function setup() {
  setCanvasSize(mainCanvas, WIDTH, HEIGHT);
  setCanvasPosition(mainCanvas);

  for (let i = 0; i < 5; i++) {
    walls.push(new Boundary(random(0, HEIGHT), random(0, HEIGHT), random(0, HEIGHT), random(0, HEIGHT), wallSize));
  }

  // borders
  walls.push(new Boundary(HEIGHT - borderSize / 2, 0, HEIGHT - borderSize / 2, HEIGHT, borderSize));
  walls.push(new Boundary(HEIGHT, HEIGHT - borderSize / 2, 0, HEIGHT - borderSize / 2, borderSize));
  walls.push(new Boundary(0 + borderSize / 2, HEIGHT, 0 + borderSize / 2, 0, borderSize));
  walls.push(new Boundary(0, 0 + borderSize / 2, HEIGHT, 0 + borderSize / 2, borderSize));

  player = new Player(10, fov);
}

function draw() {
  background("black");
  walls.forEach((wall) => wall.show());

  player.update();
  player.show();
  player.see(walls);
}

class Player {
  constructor(size, fov) {
    this.pos = createVector(HEIGHT / 2, HEIGHT / 2);
    this.size = size;
    this.fov = fov;
    this.rotationDeg = 0;
    this.intersections = [];
    this.rotationDegHeight = 0;
  }
  see(walls) {
    this.rays = [];
    this.intersections = [];
    for (let a = -this.fov / 2; a <= this.fov / 2; a += this.fov / rayAmount) {
      let direction = degreesToRadians(a + this.rotationDeg);
      this.rays.push(new Ray(this.pos.x, this.pos.y, direction));
    }
    this.rays.forEach((ray) => {
      let intersection = ray.getIntersection(walls);
      this.intersections.push(intersection);
      strokeWeight(1);
      stroke("white");
      Line(this.pos.x, this.pos.y, intersection.x, intersection.y);
    });
    this.render();
  }
  show() {
    fill("white");
    Ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
  update() {
    this.vel = createVector(0, 0);
    if (pressedKeys.find((key) => key === "W")) {
      this.vel = Vector2D.fromAngle(degreesToRadians(this.rotationDeg));
    }
    if (pressedKeys.find((key) => key === "S")) {
      this.vel = Vector2D.fromAngle(degreesToRadians(this.rotationDeg - 180));
    }
    if (pressedKeys.find((key) => key === "A")) {
      this.vel = Vector2D.fromAngle(degreesToRadians(this.rotationDeg - 90));
    }
    if (pressedKeys.find((key) => key === "D")) {
      this.vel = Vector2D.fromAngle(degreesToRadians(this.rotationDeg - 270));
    }
    let rotX = map(mouseX, 0, 1920, 0, 359);
    this.rotationDeg = rotX;

    mouseY = constrain(mouseY, 0, 700);
    let rotY = map(mouseY, 0, 700, -1000, 1000);

    this.rotationDegHeight = rotY;

    this.vel.setMag(2);
    this.pos.add(this.vel);
  }
  render() {
    let count = this.intersections.length;
    let width = WIDTH / 2 / count;
    this.intersections.forEach((intersection, index) => {
      let x = WIDTH / 2 + width * index;
      let height = (this.fov / intersection.distance) * HEIGHT;
      let brightness = map(height, 0, HEIGHT, 0, 255);
      fill(`rgb(${brightness}, ${brightness}, ${brightness})`);
      fillRect(x, HEIGHT / 2 - height / 2 - this.rotationDegHeight, width + 1, height);
    });
  }
}

class Ray {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.vector = Vector2D.fromAngle(this.angle);
  }
  getIntersection(walls) {
    let recordPos = { x: undefined, y: undefined, distance: Infinity, rayAngle: this.angle };
    walls.forEach((wall) => {
      let x1 = wall.x1;
      let y1 = wall.y1;
      let x2 = wall.x2;
      let y2 = wall.y2;

      let x3 = this.x;
      let y3 = this.y;
      let x4 = this.vector.x + this.x;
      let y4 = this.vector.y + this.y;

      let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

      let segT = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);

      let segU = (x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3);

      let t = segT / den;
      let u = -(segU / den);

      if (t >= 0 && t <= 1 && u >= 0 && den !== 0) {
        let posX = x1 + t * (x2 - x1);
        let posY = y1 + t * (y2 - y1);
        let dist = Vector2D.dist(this.x, this.y, posX, posY);
        if (dist < recordPos.distance) {
          recordPos.distance = dist;
          recordPos.x = posX;
          recordPos.y = posY;
        }
      }
    });
    return recordPos;
  }
}

class Boundary {
  constructor(x1, y1, x2, y2, size) {
    this.size = size;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  show() {
    strokeWeight(this.size);
    stroke("white");
    Line(this.x1, this.y1, this.x2, this.y2);
  }
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------

setup();
drawLoop();
