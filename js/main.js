window.AudioContext = window.AudioContext || window.webkitAudioContext;


//Main Variable
var phaseId = 0;
var volumeThreshold = 0;
var volumeMin = 0;
var socket = io.connect('breal.local:5000/client')
var DEBUG = false;
var volume,
	phase,
	timer,
	video,
	audio;

var a = [];

socket.on('newConfig', newConfig)

window.onload = function() {
	getHTML();
	setup();
	startAllSOunds();
	toggleLiveInput();
	main();
};

function newConfig(_data) {
	volumeThreshold = _data.VOLUME_THRESHOLD;
	volumeMin = _data.VOLUME_MIN;
}

function setup() {
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
}

function main() {
	micVolume = getInputVolume();
	setSplit();
	dealWithTime(volumeMin);
	updateAnalysers();
	socket.emit('sendMicVolume', micVolume, phaseId)
	window.requestAnimationFrame(main);
}

function setSplit() {

	if ((micVolume >= 0) && (micVolume < 1 * volumeThreshold)) {
		phaseId = 1;
		phase.innerHTML = phaseId;

	} else if ((micVolume >= 1 * volumeThreshold) && (micVolume < 2 * volumeThreshold)) {
		phaseId = 2;
		phase.innerHTML = phaseId;

	} else if ((micVolume >= 2 * volumeThreshold) && (micVolume < 3 * volumeThreshold)) {
		phaseId = 3;
		phase.innerHTML = phaseId;

	} else if ((micVolume >= 3 * volumeThreshold) && (micVolume < 4 * volumeThreshold)) {
		phaseId = 4;
		phase.innerHTML = phaseId;

	} else if ((micVolume >= 4 * volumeThreshold) && (micVolume < 5 * volumeThreshold)) {
		phaseId = 5;
		phase.innerHTML = phaseId;

	}

	
}

function getHTML() {
	volume = document.getElementById("volume");
	phase = document.getElementById("phase");
	timer = document.getElementById("time");
	canvas = document.getElementById("analyser");
	analyserContext = canvas.getContext('2d');
}