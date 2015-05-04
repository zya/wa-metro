var interval = 25;
self.onmessage = function (event) {
  if (event.data === 'interval') {
    interval = event.data.interval;
  }
  if (event.data === 'start') {
    setInterval(function () {
      postMessage('tick');
    }, interval);
  }
};