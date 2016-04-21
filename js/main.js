window.AudioContext = window.AudioContext || window.webkitAudioContext;


//Main Variable
var socket = io.connect('breal.local:5000/client')
var DEBUG = true;
var LOG = false;

var volume = instal.volume;
volume();

socket.on('stopVideo', debugLog);

window.onload = function() {
	getHTML();
	setup();
	startAllSOunds();
	toggleLiveInput();
	main();
};

function debugLog() {
	// console.log(volume());
}

function setup() {
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
}

function main() {
	volume().getInstalVolumeStates();

	if (DEBUG) {
		timer.innerHTML = volume().timeOverVolumeMin;
		volumeIn.innerHTML = volume().micVolume;
		phase.innerHTML = volume().volumeStepId;
		isLoudEnough.innerHTML = volume().isLoudEnough;
		listeningVolumeStepId.innerHTML = volume().listeningVolumeStepId;
		planetIdtoPlay.innerHTML = volume().planetIdtoPlay;
	}

	if (LOG) {
		console.log("")
		console.log(volume());
	}

	// dealWithTime(instal.volumeMin);
	updateAnalysers();
	// if (volumeIsLoudEnough(micVolume, instal.volumeThreshold)) {
	// 	socket.emit('sendMicVolume', micVolume)
	// }
	window.requestAnimationFrame(main);
}


function getHTML() {
	volumeIn = document.getElementById("volume");
	phase = document.getElementById("phase");
	timer = document.getElementById("time");
	canvas = document.getElementById("analyser");
	isLoudEnough = document.getElementById("isLoudEnough");
	listeningVolumeStepId = document.getElementById("listeningVolumeStepId");
	planetIdtoPlay = document.getElementById("planetIdtoPlay");
	analyserContext = canvas.getContext('2d');
}