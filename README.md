# wa-metro
Simple event scheduler for Web Audio API.

This library is based on [Chris Wilson](https://twitter.com/cwilso)'s scheduling [method](http://www.html5rocks.com/en/tutorials/audio/scheduling/) used in his [metronome](https://github.com/cwilso/metronome) example. 

### Example Usage
````js
var context = new AudioContext();
var callback = function (time, step) {
	//schedule audio events with time and step number
};
var metro = new Metro(context, callback);
metro.start();
````

### Methods
````js
var metro = new Metro(context, callback);
metro.start(); // starts the clock and schedules events
metro.stop(); // stops the clock and resets the step to 1
metro.pause(); // pauses the clock and keeps the current step number
````
### Configuration
````js
var metro = new Metro(context, callback);
metro.tempo = 100; // in BPM, defaults to 120
metro.steps = 8; // number of steps in a bar. defaults to 16
metro.look_ahead = 0.5; // look ahead time in Seconds. defaults to 1.0
````
