// objects
let walls = [];
let player;

// global variables
let canvasWidth = 1200;
let canvasHeight = 600;

let borderSize = 10;
let wallSize = 5;
let rayAmount = 1000;
let fov = 40;

function setup() {
  L.setCanvasSize(canvasWidth, canvasHeight);
  L.centerCanvas();

  // borders
  walls.push(new Boundary(canvasHeight - borderSize / 2, 0, canvasHeight - borderSize / 2, canvasHeight, borderSize));
  walls.push(new Boundary(canvasHeight, canvasHeight - borderSize / 2, 0, canvasHeight - borderSize / 2, borderSize));
  walls.push(new Boundary(0 + borderSize / 2, canvasHeight, 0 + borderSize / 2, 0, borderSize));
  walls.push(new Boundary(0, 0 + borderSize / 2, canvasHeight, 0 + borderSize / 2, borderSize));

  // walls around the game
  for (let i = 0; i < 5; i++) {
    walls.push(
      new Boundary(L.random(0, canvasHeight), L.random(0, canvasHeight), L.random(0, canvasHeight), L.random(0, canvasHeight), wallSize)
    );
  }

  // new player
  player = new Player(10, fov);
}

function draw() {
  L.background("black");
  walls.forEach((wall) => wall.show());

  player.update();
  player.show();
  player.see(walls);
}
