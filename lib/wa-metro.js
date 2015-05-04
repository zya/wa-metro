var interval = 25;
var tempo = 120;
var schedule_ahead = 0.9; // in think i seconds

var next_note_time = 0.0;
var resolution = 5;
var index = 1;

var workerFile = workerify './worker.js';
var worker = new Worker(workerFile);

function Metro(context) {

}

Metro.prototype.start = function () {
  worker.postMessage('start');
};

module.exports = Metro;