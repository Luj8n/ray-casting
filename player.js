class Player {
  constructor(size, fov) {
    this.pos = L.createVector2D(canvasHeight / 2, canvasHeight / 2);
    this.size = size;
    this.fov = fov;
    this.rotationDeg = 0;
    this.intersections = [];
    this.rotationDegHeight = 0;
  }
  see(walls) {
    let rays = [];
    this.intersections = [];
    for (let a = -this.fov / 2; a <= this.fov / 2; a += this.fov / rayAmount) {
      let direction = L.degreesToRadians(a + this.rotationDeg);
      rays.push(new Ray(this.pos.x, this.pos.y, direction));
    }
    rays.forEach((ray) => {
      let intersection = ray.getIntersection(walls);
      this.intersections.push(intersection);
      L.strokeWeight(1);
      L.stroke("white");
      L.Line(this.pos.x, this.pos.y, intersection.x, intersection.y);
    });
    this.render();
  }
  show() {
    L.fill("white");
    L.Ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
  update() {
    this.vel = L.createVector2D().limit(2);
    if (L.pressedKeys.find((key) => key === "W")) {
      this.vel.add(L.Vector2D.fromAngle(L.degreesToRadians(this.rotationDeg)));
    }
    if (L.pressedKeys.find((key) => key === "S")) {
      this.vel.add(L.Vector2D.fromAngle(L.degreesToRadians(this.rotationDeg - 180)));
    }
    if (L.pressedKeys.find((key) => key === "A")) {
      this.vel.add(L.Vector2D.fromAngle(L.degreesToRadians(this.rotationDeg - 90)));
    }
    if (L.pressedKeys.find((key) => key === "D")) {
      this.vel.add(L.Vector2D.fromAngle(L.degreesToRadians(this.rotationDeg - 270)));
    }
    this.vel.mult(2);

    let rotationX = L.map(L.mouseX, 0, 1920, 0, 359);
    this.rotationDeg = rotationX;

    let rotationY = L.constrain(L.mouseY, 0, 700);
    rotationY = L.map(rotationY, 0, 700, -1000, 1000);

    this.rotationDegHeight = rotationY;

    this.pos.add(this.vel);
  }
  render() {
    let count = this.intersections.length;
    let width = canvasWidth / 2 / count;
    this.intersections.forEach((intersection, index) => {
      let x = canvasWidth / 2 + width * index;
      let height = (this.fov / intersection.distance) * canvasHeight;
      let brightness = L.map(height, 0, canvasHeight, 0, 255);
      L.fill(`rgb(${brightness}, ${brightness}, ${brightness})`);
      L.Rectangle(x, canvasHeight / 2 - height / 2 - this.rotationDegHeight, width + 1, height);
    });
  }
}
