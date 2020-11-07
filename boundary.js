class Boundary {
  constructor(x1, y1, x2, y2, size) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.size = size;
  }
  show() {
    L.strokeWeight(this.size);
    L.stroke("white");
    L.Line(this.x1, this.y1, this.x2, this.y2);
  }
}
