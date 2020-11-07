(function (global) {
  let module = (global.L = { ...global.L });

  module.canvas = document.querySelector("#canvas");
  module.ctx = module.canvas.getContext("2d");

  // Event Listeners

  module.fullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      module.canvas.requestFullscreen();
    }
  };

  let LOCKED_POINTER = false;
  module.canvas.requestPointerLock = module.canvas.requestPointerLock || module.canvas.mozRequestPointerLock;

  module.lockPointer = () => {
    if (LOCKED_POINTER) document.exitPointerLock();
    else module.canvas.requestPointerLock();
  };

  module.mouseX = 0;
  module.mouseY = 0;

  function updateMousePos(e) {
    if (document.pointerLockElement === module.canvas || document.mozPointerLockElement === module.canvas) {
      module.mouseX += e.movementX;
      module.mouseY += e.movementY;
    } else {
      module.mouseX = e.clientX;
      module.mouseY = e.clientY;
    }
  }

  addEventListener("mousemove", updateMousePos);
  addEventListener("pointerlockchange", updateMousePos);
  addEventListener("mozpointerlockchange", updateMousePos);

  module.pressedKeys = [];

  addEventListener("keydown", (e) => {
    let key = e.key.toLocaleUpperCase();
    if (!module.pressedKeys.find((el) => el === key)) module.pressedKeys.push(key);
  });

  addEventListener("keyup", (e) => {
    let key = e.key.toLocaleUpperCase();
    module.pressedKeys = module.pressedKeys.filter((el) => el !== key);
  });

  // Canvas manipulation

  module.centerCanvas = () => {
    module.canvas.style.top = `${(innerHeight - module.canvas.height) / 2}px`;
    module.canvas.style.left = `${(innerWidth - module.canvas.width) / 2}px`;
  };

  module.width = 0;
  module.height = 0;

  module.setCanvasSize = (inputWidth, inputHeight) => {
    module.canvas.width = inputWidth;
    module.canvas.height = inputHeight;

    module.width = inputWidth;
    module.height = inputHeight;
  };

  let translatedX = 0;
  let translatedY = 0;

  module.translate = (x, y) => {
    translatedX += x;
    translatedY += y;
    module.ctx.translate(x, y);
  };

  module.background = (color = "white") => {
    module.ctx.fillStyle = color;
    module.ctx.fillRect(0, 0, module.canvas.width, module.canvas.height);
  };

  module.getImageData = (x, y, width, height) => {
    return module.ctx.getImageData(x, y, width, height);
  };

  module.putImageData = (imageData, x, y) => {
    return module.ctx.putImageData(imageData, x, y);
  };

  // Animation manipulation

  let NO_LOOP = false;

  module.noLoop = () => {
    NO_LOOP = true;
  };

  let FPS = 60;

  module.frameRate = (fps) => {
    FPS = fps;
  };

  let REAL_FPS = FPS;

  module.getFrameRate = () => {
    return REAL_FPS;
  };

  // Drawing styles

  let NO_STROKE = false;
  let NO_FILL = false;

  module.strokeWeight = (weight) => {
    module.ctx.lineWidth = weight;
    NO_STROKE = false;
  };

  module.stroke = (color = "white") => {
    module.ctx.strokeStyle = color;
    NO_STROKE = false;
  };

  module.fill = (color = "white") => {
    module.ctx.fillStyle = color;
    NO_FILL = false;
  };

  module.noFill = () => {
    NO_FILL = true;
  };

  module.noStroke = () => {
    NO_STROKE = true;
  };

  // for text

  module.textFont = (font) => {
    module.ctx.font = font;
  };

  module.textAlign = (textAlign) => {
    module.ctx.textAlign = textAlign;
  };

  module.textBaseline = (textBaseline) => {
    module.ctx.textBaseline = textBaseline;
  };

  module.textDirection = (direction) => {
    module.ctx.direction = direction;
  };

  // Shapes

  module.Text = (text, x, y, maxWidth) => {
    module.ctx.beginPath();
    let params = [text, x, y, maxWidth];
    if (typeof maxWidth == "undefined") {
      params = [text, x, y];
    }
    if (!NO_FILL) module.ctx.fillText(...params);
    else module.ctx.strokeText(...params);
    module.ctx.closePath();
  };

  module.Line = (x0, y0, x1, y1) => {
    module.ctx.beginPath();
    module.ctx.moveTo(x0, y0);
    module.ctx.lineTo(x1, y1);
    if (!NO_STROKE) module.ctx.stroke();
    else module.ctx.fill();
    module.ctx.closePath();
  };

  module.Ellipse = (x, y, size1, size2 = size1) => {
    module.ctx.beginPath();
    module.ctx.ellipse(x, y, size1 / 2, size2 / 2, 0, 0, 2 * Math.PI);
    if (!NO_FILL) module.ctx.fill();
    else module.ctx.stroke();
    module.ctx.closePath();
  };

  module.Rectangle = (x, y, width, height) => {
    module.ctx.beginPath();
    module.ctx.rect(x, y, width, height);
    if (!NO_FILL) module.ctx.fill();
    else module.ctx.stroke();
    module.ctx.closePath();
  };

  let FIRST_VERTEX = false;

  module.beginShape = () => {
    FIRST_VERTEX = true;
    module.ctx.beginPath();
  };

  module.endShape = () => {
    if (!NO_FILL) module.ctx.fill();
    else module.ctx.stroke();
    module.ctx.closePath();
  };

  module.Vertex = (x, y) => {
    if (FIRST_VERTEX) {
      FIRST_VERTEX = false;
      module.ctx.moveTo(x, y);
    } else module.ctx.lineTo(x, y);
  };

  module.Image = (p1, p2, p3, p4, p5, p6, p7, p8, p9) => {
    // parameters should be: image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
    let params = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
    let validParams = params.filter((param) => typeof param != "undefined");
    module.ctx.drawImage(...validParams);
  };

  // Preloading things

  let LOADED = false;

  let LOADING_COUNT = 0;

  module.loadImage = (source, callback) => {
    LOADING_COUNT += 1;

    let image = new Image();
    image.addEventListener("load", () => {
      LOADING_COUNT -= 1;
      if (typeof callback != "undefined") callback();
      tryLoading();
    });
    image.src = source;
    return image;
  };

  module.loadAudio = (source, callback) => {
    LOADING_COUNT += 1;

    let audio = new Audio();
    audio.addEventListener("canplaythrough", () => {
      LOADING_COUNT -= 1;
      if (typeof callback != "undefined") callback();
      tryLoading();
    });
    audio.src = source;
    return image;
  };

  function tryLoading() {
    if (LOADING_COUNT == 0 && LOADED == false) {
      startLoad();
      LOADED = true;
    }
  }

  function startLoad() {
    if (typeof setup == "function") {
      setup();
    }
    if (typeof draw == "function") {
      startLoop();
    }
  }

  // Animation Loop
  function startLoop() {
    let startTime = new Date();
    setTimeout(() => {
      draw();
      module.translate(-translatedX, -translatedY);
      if (!NO_LOOP) {
        let endTime = new Date();
        let timeDifference = (endTime - startTime) / 1000;
        REAL_FPS = 1 / timeDifference;
        requestAnimationFrame(startLoop); // Create an animation loop
      }
    }, 1000 / FPS);
  }

  addEventListener("DOMContentLoaded", () => {
    if (typeof preload == "function") {
      preload();
      tryLoading();
    } else {
      startLoad();
    }
  });
})(this);
