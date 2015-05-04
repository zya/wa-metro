var Metro = require('./lib/wa-metro');

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

var metro = new Metro(context, 120, 16, cb);
metro.start();
setTimeout(function () {
  console.log('stop');
  metro.stop();
}, 2000);
setTimeout(function () {
  console.log('start');
  metro.start();
}, 5000);

module.exports = require('./lib/wa-metro');