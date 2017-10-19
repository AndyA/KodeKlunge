$(function() {
  function radixDigits(radix, n) {
    var digits = 1;
    while (Math.pow(radix, digits) < n) {
      digits++;
    }
    return digits;
  }

  var MAX = 1000000;
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
    console.log(info);
    console.log(digits);

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
    value += 0.05;
    odos.forEach(function(info) {
      info.odo.render(info.ctx, value);
    });
  }

  setInterval(update, 20);


});
