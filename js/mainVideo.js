window.AudioContext = window.AudioContext || window.webkitAudioContext;


//Main Variable
var phaseId = 0;
var volumeThreshold = 0;
var volumeDeadBand = 1;
var micVolume = 0;
var socket = io.connect('breal.local:5000/client')
var phaseId = 0;
var phaseIdLastUpdate = 0;
var volume,
	phase,
	timer,
	video,
	audio;
var initialTime = 0;
var finalTime = 0;
var volumeTimers = [0,0,0,0,0]; 

var a = [];

socket.on('updateMicVolume', main)

socket.on('newConfig', newConfig)

v = document.getElementsByTagName("video")[0];

function newConfig(_data) {
	volumeThreshold = _data.VOLUME_THRESHOLD;
	createVideoBalise(_data.NB_VIDEO_CREATION);
}

function createVideoBalise(_nbMaxVideo){
	var idDiv = '';
	for (var i = 0; i < _nbMaxVideo; i++) {
		idDiv = "sprite-" + String(i);
		$('body').append('<div id='+idDiv+'><video  controls="no-controls" autoplay muted loop><source src="videos/video2.webm" type="video/webm" /></video></div>')
	}
	
}

function main(_micVolume, _phaseId) {
	micVolume = _micVolume;
	var timeData = getDeltaBetweenTimes(initialTime, finalTime);

	for (var i = 0; i < 5; i++) {

		setSplitNew(i, timeData, 5);
	}
	
}

function fadeOutAllSpriteButOne(_indexSplit,_maxSplits){
	for (var i = 0; i < _maxSplits; i++) {
		var sprite = "#sprite-" + String(i);
		if (i == _indexSplit){
			$(sprite).fadeIn();
		}else{
			$(sprite).fadeOut();
		}
	}
}

function dealWithSplits (_indexSplit, _maxSplits, _delta){
	for (var i = 0; i < _maxSplits; i++) {
		if (_indexSplit == i){
			volumeTimers[i] = increaseTime(volumeTimers[i], _delta);
			if (volumeTimers[i] > volumeDeadBand){
				fadeOutAllSpriteButOne(i,_maxSplits);
			}	
		}
		else
		{
			volumeTimers[i] = 0;
		}	
	}
}

function setSplitNew(_indexSplit, _timeData, _maxSplits) {
	var delta = _timeData[0];
	initialTime = _timeData[1];
	finalTime = _timeData[2];

	if ((micVolume >= _indexSplit * volumeThreshold) && (micVolume < (_indexSplit+1) * volumeThreshold)) {

		dealWithSplits (_indexSplit, _maxSplits, delta)
	}
}