class Ray {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.vector = L.Vector2D.fromAngle(this.angle);
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
        let dist = L.dist(this.x, this.y, posX, posY);
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
