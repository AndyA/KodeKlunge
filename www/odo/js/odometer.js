function Odometer(options) {

  this.opt = $.extend({}, {
    digitWidth: 30,
    digitHeight: 40,
    radix: 16,
    digits: 8
  }, options || {});

  this.numberStrip = this.makeStrip();
}

$.extend(Odometer.prototype, {
  makeStrip: function() {
    var dw = this.opt.digitWidth;
    var dh = this.opt.digitHeight;
    var cvs = document.createElement("canvas");

    cvs.width = dw;
    cvs.height = dh * (this.opt.radix + 1);

    var ctx = cvs.getContext("2d");

    ctx.save();
    var fontSize = (dw + dh) / 2;
    ctx.font = Math.round(fontSize) + "px monospace";
    ctx.fillStyle = "black";

    for (var d = 0; d <= this.opt.radix; d++) {
      var dd = d % this.opt.radix;
      var cc = dd < 10 ? "0".charCodeAt(0) + dd : "A".charCodeAt(0) - 10 + dd;
      ctx.fillText(String.fromCharCode(cc), 5, (d + 1) * dh - 8);
    }

    ctx.restore();

    return cvs;
  },

  render: function(ctx, value) {
    var dw = this.opt.digitWidth;
    var dh = this.opt.digitHeight;
    ctx.clearRect(0, 0, dw * this.opt.digits, dh);
    var val = Math.floor(value);
    var frac = value - val;
    for (var d = 0; d < this.opt.digits; d++) {
      var x = dw * (this.opt.digits - d - 1);
      var dv = Math.floor(val % this.opt.radix);
      ctx.drawImage(this.numberStrip, 0, (dv + frac) * dh, dw, dh, x, 0,
        dw, dh);
      if (dv < this.opt.radix - 1) frac = 0;
      val = Math.floor(val / this.opt.radix);
    }
  }
});
