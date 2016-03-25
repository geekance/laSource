window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var analyserContext = null;
var theBuffer = null;
var DEBUGCANVAS = false;
var mediaStreamSource = null;
var initialTime = 0;
var finalTime = 0;
var maxLoopWithNoSound = 3;
var phaseTime = 4;
var soundLevelMin = 10;
var time = 0; //Time
var sampleRate = 10; //Time in ms, set period for sampling the mic input
var phaseId = 0; //Id of the current phase
var minVelocity = 120;

var detectorElem,
	canvasElem,
	waveCanvas,
	pitchElem,
	noteElem,
	detuneElem,
	detuneAmount,
	volume,
	phase,
	timer,
	video;

var a = [];

window.onload = function() {
	audioContext = new AudioContext();
	MAX_SIZE = Math.max(4, Math.floor(audioContext.sampleRate / 5000)); // corresponds to a 5kHz signal

	//-----------
	// var canvas = document.getElementById('video');
	// var ctx = canvas.getContext('2d');
	// var video = document.getElementById('videoS');

	// video.addEventListener('play', function() {
	// 	var $this = this; //cache
	// 	(function loop() {
	// 		if (!$this.paused && !$this.ended) {
	// 			ctx.drawImage($this, 0, 0);
	// 			setTimeout(loop, 1000 / 30); // drawing at 30fps
	// 		}
	// 	})();
	// }, 0);
	//----------

	detectorElem = document.getElementById("detector");
	canvasElem = document.getElementById("output");
	DEBUGCANVAS = document.getElementById("waveform");
	volume = document.getElementById("volume");
	phase = document.getElementById("phase");
	timer = document.getElementById("time");

	for (var i = 0; i < 10; i++) {
		a = document.getElementById("audio"+String(i));
		a.play();
		a.loop = true;
	}
	


	if (DEBUGCANVAS) {
		waveCanvas = DEBUGCANVAS.getContext("2d");
		waveCanvas.strokeStyle = "black";
		waveCanvas.lineWidth = 1;
	}
	pitchElem = document.getElementById("pitch");
	noteElem = document.getElementById("note");
	detuneElem = document.getElementById("detune");
	detuneAmount = document.getElementById("detune_amt");
	high = document.getElementById("high");
	mid = document.getElementById("mid");
	low = document.getElementById("low");

	toggleLiveInput();
	// video.play();
}

function main() {

	if (initialTime == 0) {
		finalTime = Date.now();
	}
	initialTime = finalTime;
	finalTime = Date.now();

	if (volume.innerHTML > soundLevelMin) {
		if (time < 4 * phaseTime) {
			increaseTime();

		}
		updatePitch();
		// console.log("here");

	} else {
		if (time > 0) {
			decreaseTime();
		}
	}
	setPhase();
	timer.innerHTML = time;
	window.setTimeout(main, sampleRate);
}

function setPhase() {
	if (time == 0) {
		phaseId = 0;
		phase.innerHTML = phaseId;
	} else if (time < phaseTime) {
		phaseId = 1;
		phase.innerHTML = phaseId;
	} else if ((time >= phaseTime) && (time < 2 * phaseTime)) {
		phaseId = 2;
		phase.innerHTML = phaseId;
	} else if ((time >= 2 * phaseTime) && (time < 3 * phaseTime)) {
		phaseId = 3;
		phase.innerHTML = phaseId;
	} else if ((time >= 3 * phaseTime) && (time < 4 * phaseTime)) {
		phaseId = 4;
		phase.innerHTML = phaseId;
	}
}