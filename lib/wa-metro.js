var work = require('webworkify');

function Metro(context, cb) {
  var self = this;

  if (!context) throw new Error('Context is mandatory');
  if (!cb) throw new Error('Callback is mandatory');
  this.context = context;
  this.steps = 16;
  this.tempo = 120;
  this.cb = cb;
  this.look_ahead = 1.0;

  this._step = 1;
  this._scheduler_interval = 20;
  this._next_event_time = 0.0;
  this._first = true;
  this._is_running = false;

  this._worker = work(require('./worker.js'));

  this._worker.onmessage = function (event) {
    if (event.data === 'tick') {
      self._scheduler();
    }
  };

  this._worker.postMessage({
    'interval': self._scheduler_interval
  });
}

Metro.prototype.start = function (cb) {
  if (this._is_running) {
    console.log('already started');
    return;
  }
  this._is_running = true;
  this._worker.postMessage('start');
};

Metro.prototype.pause = function () {
  this._is_running = false;
  this._worker.postMessage('stop');
};

Metro.prototype.stop = function () {
  this._first = true;
  this._is_running = false;
  this._worker.postMessage('stop');
};

Metro.prototype._scheduler = function _scheduler() {
  var self = this;
  while (this._next_event_time < this.context.currentTime + this.look_ahead) {
    this.cb(self._next_event_time, self._step);
    this._next();
  }
};

Metro.prototype._next = function _next() {
  this._step++;
  if (this._first) {
    this._step = 1;
    this._next_event_time = this.context.currentTime;
    this._first = false;
  }
  if (this._step > this.steps) {
    this._step = 1;
  }
  this._next_event_time += ((60.0 / this.tempo) * 4) / this.steps;
};

module.exports = Metro;