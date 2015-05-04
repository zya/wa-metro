var interval = 50;
var tempo = 120;
var schedule_ahead = 0.9; // in think i seconds

var next_note_time = 0.0;
var resolution = 5;
var index = 1;
var workerFile = workerify './worker.js';

var callback = function (time, index) {
  console.log('callback');
};

function Metro(context, resolution, cb) {
  this.context = context;
  this.cb = cb;
  this.resolution = resolution;
  this._worker = new Worker(workerFile);
  var self = this;

  this._worker.onmessage = function (event) {
    if (event.data === 'tick') {
      self._scheduler();
    }
  };
}

Metro.prototype.start = function () {
  this._worker.postMessage({
    'interval': interval
  });
  this._worker.postMessage('start');
};

Metro.prototype._scheduler = function _scheduler() {

  while (next_note_time < this.context.currentTime + schedule_ahead) {
    this.cb(next_note_time, index);
    this._next();
  }
};

Metro.prototype._next = function _next() {
  index++;
  if (index > resolution) {
    index = 1;
  }
  console.log(next_note_time);
  next_note_time += ((60.0 / tempo) * 2) / resolution;
};

module.exports = Metro;