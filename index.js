var Metro = require('./lib/wa-metro.js');

var context = new AudioContext();
var cb = function (time, step) {
  var osc = context.createOscillator();
  osc.connect(context.destination);
  osc.start(time);
  osc.stop(time + 0.1);
};
var metro = new Metro(context, 8, cb);
metro.start();