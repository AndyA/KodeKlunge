const {
  sprintf,
  vsprintf
} = require('sprintf-js');

function timesTwo(x) {
  return x * 2;
}

function timesFour(x) {
  return x * 4;
}

function fib(x) {
  if (x < 2) return 1;
  return fib(x - 1) + fib(x - 2);
}

function tryFunction(f) {
  console.log("\nTesting " + f.name)
  for (let i = -2; i <= 20; i++) {
    console.log(sprintf("%s(%5d) => %5d", f.name, i, f(i)));
  }
}

tryFunction(timesTwo);
tryFunction(timesFour);
tryFunction(fib);
