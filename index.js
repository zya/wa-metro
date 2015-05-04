var Metro = require('./lib/wa-metro.js');

var context = new AudioContext();
var cb = function (time, step) {
  var osc = context.createOscillator();
  if (step === 1) {
    osc.frequency.value = 880;
  }
  osc.connect(context.destination);
  osc.start(time);
  osc.stop(time + 0.1);
};
var metro = new Metro(context, 120, 8, cb);
setTimeout(function () {
  metro.start();
}, 3000);