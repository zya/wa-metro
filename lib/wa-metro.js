var work = require('webworkify');

function Metro(context, tempo, resolution, cb) {
  var self = this;

  this.context = context;
  this.cb = cb;
  this.resolution = resolution;
  this.tempo = tempo;

  this._index = 1;
  this._next_note_time = 0.0;
  this._look_ahead = 0.5;
  this._intervcal = 50;
  this._first = true;

  this._worker = work(require('./worker.js'));

  this._worker.onmessage = function (event) {
    if (event.data === 'tick') {
      self._scheduler();
    }
  };
  this._worker.postMessage({
    'interval': self._interval
  });
}

Metro.prototype.start = function () {
  this._worker.postMessage('start');
};

Metro.prototype.pause = function () {
  this._worker.postMessage('stop');
};

Metro.prototype.stop = function () {
  this._first = true;
  this._worker.postMessage('stop');
};

Metro.prototype._scheduler = function _scheduler() {
  var self = this;
  while (this._next_note_time < this.context.currentTime + this._look_ahead) {
    this.cb(self._next_note_time, self._index);
    this._next();
  }
};

Metro.prototype._next = function _next() {
  this._index++;
  if (this._first) {
    this._index = 1;
    this._next_note_time = this.context.currentTime;
    this._first = false;
  }
  if (this._index > this.resolution) {
    this._index = 1;
  }
  this._next_note_time += ((60.0 / this.tempo) * 4) / this.resolution;
};

module.exports = Metro;