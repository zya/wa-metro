var workerFile = workerify './worker.js';

function Metro(context, tempo, resolution, cb) {
  this.context = context;
  this.cb = cb;
  this.resolution = resolution;
  this.tempo = tempo;

  this._worker = new Worker(workerFile);
  this._index = 1;
  this._next_note_time = 0.0;
  this._look_ahead = 1.0;
  this._intervcal = 50;
  var self = this;
  this._worker.onmessage = function (event) {
    if (event.data === 'tick') {
      self._scheduler();
    }
  };
}

Metro.prototype.start = function () {
  var self = this;
  this._worker.postMessage({
    'interval': self._interval
  });
  this._worker.postMessage('start');
};

Metro.prototype._scheduler = function _scheduler() {

  while (this._next_note_time < this.context.currentTime + this._look_ahead) {
    this.cb(this._next_note_time, self._index);
    this._next();
  }
};

Metro.prototype._next = function _next() {
  this.index++;
  if (this.index > this.resolution) {
    this.index = 1;
  }
  this._next_note_time += ((60.0 / this.tempo) * 2) / this.resolution;
};

module.exports = Metro;