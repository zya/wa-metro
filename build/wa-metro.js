(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// var Metro = require('./lib/wa-metro');

// var context = new AudioContext();
// var cb = function (time, step) {
//   var osc = context.createOscillator();
//   if (step === 1) {
//     osc.frequency.value = 880;
//   }
//   osc.connect(context.destination);
//   osc.start(time);
//   osc.stop(time + 0.1);
// };

// var metro = new Metro(context, 120, 16, cb);
// metro.start();
// setTimeout(function () {
//   console.log('stop');
//   metro.stop();
// }, 2000);
// setTimeout(function () {
//   console.log('start');
//   metro.start();
// }, 5000);

module.exports = require('./lib/wa-metro');
},{"./lib/wa-metro":2}],2:[function(require,module,exports){
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
},{"./worker.js":3,"webworkify":4}],3:[function(require,module,exports){
module.exports = function (self) {
  var interval = 25;
  var timer = null;
  self.onmessage = function (event) {
    if (event.data === 'interval') {
      interval = event.data.interval;
    }
    if (event.data === 'start') {
      timer = setInterval(function () {
        postMessage('tick');
      }, interval);
    }

    if (event.data === 'stop') {
      clearInterval(timer);
      timer = null;
    }
  };
};
},{}],4:[function(require,module,exports){
var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];

var stringify = JSON.stringify;

module.exports = function (fn) {
    var keys = [];
    var wkey;
    var cacheKeys = Object.keys(cache);
    
    for (var i = 0, l = cacheKeys.length; i < l; i++) {
        var key = cacheKeys[i];
        if (cache[key].exports === fn) {
            wkey = key;
            break;
        }
    }
    
    if (!wkey) {
        wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
        var wcache = {};
        for (var i = 0, l = cacheKeys.length; i < l; i++) {
            var key = cacheKeys[i];
            wcache[key] = key;
        }
        sources[wkey] = [
            Function(['require','module','exports'], '(' + fn + ')(self)'),
            wcache
        ];
    }
    var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
    
    var scache = {}; scache[wkey] = wkey;
    sources[skey] = [
        Function(['require'],'require(' + stringify(wkey) + ')(self)'),
        scache
    ];
    
    var src = '(' + bundleFn + ')({'
        + Object.keys(sources).map(function (key) {
            return stringify(key) + ':['
                + sources[key][0]
                + ',' + stringify(sources[key][1]) + ']'
            ;
        }).join(',')
        + '},{},[' + stringify(skey) + '])'
    ;
    
    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    
    return new Worker(URL.createObjectURL(
        new Blob([src], { type: 'text/javascript' })
    ));
};

},{}]},{},[1]);
