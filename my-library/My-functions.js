function random(a, b) {
  if (typeof b == "undefined") {
    return Math.random() * a;
  } else {
    return Math.random() * (b - a) + a;
  }
}

function radiansToDegrees(rad) {
  return rad * (180 / Math.PI);
}

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function constrain(n, min, max) {
  if (n > max) {
    return max;
  } else if (n < min) {
    return min;
  } else {
    return n;
  }
}

function createVector(x = 0, y = 0) {
  let mag = Math.sqrt(x * x + y * y);
  let dir = Math.atan(y / x);
  if (x >= 0 && y >= 0) {
    // first quadrant
  } else if (x <= 0 && y >= 0) {
    // second quadrant
    dir += Math.PI;
  } else if (x < 0 && y <= 0) {
    // third quadrant
    dir += Math.PI;
  } else if (x >= 0 && y <= 0) {
    // fourth quadrant
    dir += Math.PI * 2;
  }
  return new Vector2D(mag, dir, x, y);
}
