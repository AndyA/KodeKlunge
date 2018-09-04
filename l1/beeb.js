function randBetween(lo, hi, power = 1) {
  return Math.pow(Math.random(), power) * (hi - lo) + lo;
}

$(function() {
  var cvs = document.getElementById("beeb")
  var ctx = cvs.getContext("2d");

  /* accepts parameters
   * h  Object = {h:x, s:y, v:z}
   * OR
   * h, s, v
   */
  function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v, g = t, b = p;
        break;
      case 1:
        r = q, g = v, b = p;
        break;
      case 2:
        r = p, g = v, b = t;
        break;
      case 3:
        r = p, g = q, b = v;
        break;
      case 4:
        r = t, g = p, b = v;
        break;
      case 5:
        r = v, g = p, b = q;
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  function hsva(h, s, v, a) {
    const rgb = HSVtoRGB(h, s, v);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
  }

  function randomBall() {
    var maxSize = Math.min(cvs.width, cvs.height) / 8;
    var minSize = maxSize / 10;

    var size = randBetween(minSize, maxSize, 5);
    var x = randBetween(size, cvs.width - size);
    var y = randBetween(size, cvs.height - size);
    var speed = 4;
    var rate = 3;

    var dx = randBetween(0, speed, rate);
    var dy = randBetween(0, speed, rate);

    var ddx = 0; //randBetween(0, speed / 10, 20);
    var ddy = 0; //randBetween(0, speed / 10, 20);

    var strokeStyle = hsva(Math.random(), 1, 1, 0.1);
    var fillStyle = hsva(Math.random(), 1, 1, 0.03);

    return {
      x,
      y,
      dx,
      dy,
      ddx,
      ddy,
      size,
      strokeStyle,
      fillStyle
    };
  }

  function randomBalls(n) {
    var balls = [];
    for (let i = 0; i < n; i++)
      balls.push(randomBall());
    return balls;
  }

  function makeBlender(ba, bb, props, steps) {
    if (ba.blending || bb.blending)
      return null;

    let baValue = { ...ba
    };
    let bbValue = { ...bb
    };

    let step = 0;

    ba.blending = bb.blending = true;

    return () => {
      const ratio = step / steps;
      for (const prop of props) {
        ba[prop] = baValue[prop] * (1 - ratio) + bbValue[prop] * ratio;
        bb[prop] = bbValue[prop] * (1 - ratio) + baValue[prop] * ratio;
      }

      if (++step <= steps)
        return false;

      ba.blending = bb.blending = false;

      return true;
    }
  }

  function drawBall(b) {

    ctx.lineWidth = 3;
    ctx.strokeStyle = b.strokeStyle;
    ctx.fillStyle = b.fillStyle;

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  function updateBall(b) {
    b.x += b.dx;
    b.y += b.dy;

    if (b.x > cvs.width - b.size || b.x < b.size) {
      b.dx = -b.dx;
      b.x += b.dx;
    }

    if (b.y > cvs.height - b.size || b.y < b.size) {
      b.dy = -b.dy;
      b.y += b.dy;
    }

    if (b.x < b.size) b.x += 1;
    if (b.x > cvs.width - b.size) b.x -= 1;
    if (b.y < b.size) b.y += 1;
    if (b.y > cvs.height - b.size) b.y -= 1;

    b.dx += b.ddx;
    b.dy += b.ddy;

    if (Math.abs(b.dx) > 5) b.ddx = -b.ddx;
    if (Math.abs(b.dy) > 5) b.ddy = -b.ddy;
  }

  var blenders = [];
  var balls = randomBalls(100);

  function getBlender(props, steps) {
    while (true) {
      let ba = balls[Math.floor(randBetween(0, balls.length))];
      let bb = balls[Math.floor(randBetween(0, balls.length))];
      const blender = makeBlender(ba, bb, props, steps);
      if (blender) return blender;
    }
  }

  function runBlenders(n) {
    if (blenders.length < n) {
      const props = ["x", "y", "size", "dx", "dy", "ddx", "ddy"]
        .filter((x) => Math.random() < 0.31);
      const steps = 110 - Math.floor(randBetween(10, 100, 2));
      blenders.push(getBlender(props, steps));
    }

    var newBlenders = [];
    for (const bf of blenders) {
      if (!bf()) newBlenders.push(bf);
    }
    blenders = newBlenders;
  }

  function update() {
    // ctx.clearRect(0, 0, cvs.width, cvs.height);
    for (var ball of balls) {
      drawBall(ball);
      updateBall(ball);
    }
    runBlenders(9);
  }

  setInterval(update, 20);
});
