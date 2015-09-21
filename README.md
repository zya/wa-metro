# wa-metro
Simple event scheduler for Web Audio API.

This library is based on [Chris Wilson](https://twitter.com/cwilso)'s scheduling [method](http://www.html5rocks.com/en/tutorials/audio/scheduling/) used in his [metronome](https://github.com/cwilso/metronome) example. 

### Installation
You can install `wa-metro` from npm.
````
npm install wa-metro
````
Or grab the latest version from [build folder](https://github.com/zya/wa-metro/tree/master/build) and include it in your html.
````html

<script src='wa-metro.min.js'></script>
````
### Example Usage
````js
var context = new AudioContext();
var callback = function (time, step) {
	//schedule audio events with time and step number
};
var metro = new Metro(context, callback);
metro.start();
````
### Callback
The callback function will have `time`, `step` and `timeFromScheduled` parameters. You can use these values to create dynamic loops and animations.

#### Callback Parameters
* `time` - the audio time for the step which can be used to schedule audio events.
* `step`  - the number of the scheduled step.
* `timeFromScheduled`  - the time (in seconds) that the event will be triggered from the schedule event (`time - context.currentTime`). This time can be used to schedule animations and other events as shown in the example below.

````js
var metro = new Metro(context, callback);
function callback(time, step, timeFromScheduled) {
	var osc = context.createOscillator();
	osc.connect(context.destination);
	if(step === 1) {
		osc.frequency.value = 880;
	}
	osc.start(time);
	osc.stop(time + 0.1);

  setTimeout(function(){
    // trigger some js event
  }, timeFromScheduled * 1000);
}
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
metro.callback = function(time, step){}; // change the callback
````

