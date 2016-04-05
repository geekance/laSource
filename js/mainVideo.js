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
}

function main(_micVolume, _phaseId) {
	micVolume = _micVolume;
	var timeData = getDeltaBetweenTimes(initialTime, finalTime);

	for (var i = 0; i < 5; i++) {

		setSplitNew(i, timeData, 5);
	}
	// setSplitOld();
	console.log(volumeTimers);
	
}

function setSplitOld() {
	// 0->5.1:1 
	// 5->10:2
	// 5->10:3
	// 10->15:4
	// 15->20:5
	var returns = getDeltaBetweenTimes(initialTime, finalTime);
	var delta = returns[0];
	initialTime = returns[1];
	finalTime = returns[2];

	

	if ((micVolume >= 0) && (micVolume < 1 * volumeThreshold)) {

		volumeTimers[0] = increaseTime(volumeTimers[0], delta);
		volumeTimers[1] = 0;
		volumeTimers[2] = 0;
		volumeTimers[3] = 0;
		volumeTimers[4] = 0;
		if (volumeTimers[0] > volumeDeadBand){
			$("#sprite-2, #sprite-3, #sprite-4, #sprite-5 ").fadeOut();
			$("#sprite-1").fadeIn();
		}
			

	} else if ((micVolume >= 1 * volumeThreshold) && (micVolume < 2 * volumeThreshold)) {
		volumeTimers[0] = 0;
		volumeTimers[1] = increaseTime(volumeTimers[1], delta);
		volumeTimers[2] = 0;
		volumeTimers[3] = 0;
		volumeTimers[4] = 0;
		if (volumeTimers[1] > volumeDeadBand){
			$("#sprite-1, #sprite-3, #sprite-4, #sprite-5 ").fadeOut();
			$("#sprite-2").fadeIn();
		}

	} else if ((micVolume >= 2 * volumeThreshold) && (micVolume < 3 * volumeThreshold)) {
		volumeTimers[0] = 0;
		volumeTimers[1] = 0;
		volumeTimers[2] = increaseTime(volumeTimers[2], delta);
		volumeTimers[3] = 0;
		volumeTimers[4] = 0;

		if (volumeTimers[2] > volumeDeadBand){
			$("#sprite-2, #sprite-1, #sprite-4, #sprite-5 ").fadeOut();
			$("#sprite-3").fadeIn();
		}

	} else if ((micVolume >= 3 * volumeThreshold) && (micVolume < 4 * volumeThreshold)) {
		volumeTimers[0] = 0;
		volumeTimers[1] = 0;
		volumeTimers[2] = 0;
		volumeTimers[3] = increaseTime(volumeTimers[3], delta);
		volumeTimers[4] = 0;

		if (volumeTimers[3] > volumeDeadBand){
			$("#sprite-2, #sprite-3, #sprite-1, #sprite-5 ").fadeOut();
			$("#sprite-4").fadeIn();
		}

	} else if ((micVolume >= 4 * volumeThreshold) && (micVolume < 5 * volumeThreshold)) {
		volumeTimers[0] = 0;
		volumeTimers[1] = 0;
		volumeTimers[2] = 0;
		volumeTimers[3] = 0;
		volumeTimers[4] = increaseTime(volumeTimers[4], delta);

		
		if (volumeTimers[3] > volumeDeadBand){	
			$("#sprite-2, #sprite-3, #sprite-4, #sprite-1 ").fadeOut();
			$("#sprite-5").fadeIn();
		}
	}
}

//---refactor

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