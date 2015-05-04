var blob = URL.createObjectURL(new Blob(['(',
  function () {
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
  }.toString(),

  ')()'
], {
  type: 'application/javascript'
}));

module.exports = blob;