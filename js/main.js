window.AudioContext = window.AudioContext || window.webkitAudioContext;


//Main Variable
var socket = io.connect('breal.local:5000/client')
var DEBUG = false;
var LOG = false;

var volume = instal.volume;
volume();

socket.on('stopVideo', debugLog);

key('l', function() {
	if (LOG) {
		LOG = false;
	} else {
		LOG = true;
	}
});

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
	volume().getInstalVolume();
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
	analyserContext = canvas.getContext('2d');
}