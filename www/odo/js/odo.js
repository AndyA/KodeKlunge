$(function() {
  function radixDigits(radix, n) {
    var digits = 1;
    while (Math.pow(radix, digits) < n) {
      digits++;
    }
    return digits;
  }

  var MAX = 65536;
  var DIGITWIDTH = 30;
  var DIGITHEIGHT = 40;

  var spec = [{
      radix: 2,
      name: "binary"
    },
    {
      radix: 3,
      name: "ternary"
    },
    {
      radix: 8,
      name: "octal"
    },
    {
      radix: 10,
      name: "decimal"
    },
    {
      radix: 16,
      name: "hexadecimal"
    },
    {
      radix: 36,
      name: "base36"
    }
  ];

  var $odos = $("#odometers");
  var odos = [];

  spec.forEach(function(info) {
    var digits = radixDigits(info.radix, MAX);

    $odo = $("<div/>")
      .attr({
        class: "odometer"
      });

    $odo.append($("<h2>")
      .text(info.name + " (base " + info.radix + ")"));

    var $cvs = $("<canvas/>")
      .attr({
        width: digits * DIGITWIDTH,
        height: DIGITHEIGHT
      });

    $odo.append($cvs);

    var odo = new Odometer({
      digitWidth: DIGITWIDTH,
      digitHeight: DIGITHEIGHT,
      radix: info.radix,
      digits: digits
    });

    odos.push({
      ctx: $cvs[0].getContext("2d"),
      odo: odo
    });

    $odos.append($odo);

  });

  var value = 0;

  function update() {
    odos.forEach(function(info) {
      info.odo.render(info.ctx, value);
    });
  }

  if (true) {
    setInterval(function() {
      value += 0.05;
      update();
    }, 20);

  } else {
    $(window)
      .on("mousemove", function(ev) {
        var cx = $(this)
          .width() / 2;
        var cy = $(this)
          .height() / 2;
        var dx = ev.pageX - cx;
        var dy = ev.pageY - cy;
        var max = Math.sqrt(cx * cx + cy * cy);
        var dist = Math.sqrt(dx * dx + dy * dy) / max;
        value = MAX * Math.pow(dist, 5);
        update();
      });
  }

});
