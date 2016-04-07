window.AudioContext = window.AudioContext || window.webkitAudioContext;


//Main Variable
var volumeThreshold = 0;   
var volumeDeadBand = 0.5;
var micVolume = 0;
var socket = io.connect('breal.local:5000/client');
var initialTime = 0;
var finalTime = 0;
var volumeTimers = []; 
var nbVideoCreation;

var a = [];

socket.on('updateMicVolume', main);

socket.on('newConfig', newConfig);

v = document.getElementsByTagName("video")[0];

function newConfig(_data) {
	volumeThreshold = _data.VOLUME_THRESHOLD;
	nbVideoCreation = _data.NB_VIDEO_CREATION;
	createVideoBalise(nbVideoCreation);
}

function createVideoBalise(_nbMaxVideo){
	var idDiv = '';
	for (var i = 0; i < _nbMaxVideo; i++) {
		idDiv = "sprite-" + String(i);
		$('body').append('<div id='+idDiv+'><video  controls="no-controls" autoplay muted loop><source src="videos/video2.webm" type="video/webm" /></video></div>');
	}
	
}

function main(_micVolume, _phaseId) {
	micVolume = _micVolume;
	var timeData = getDeltaBetweenTimes(initialTime, finalTime);

	for (var i = 0; i < nbVideoCreation; i++) {

		setSplitNew(i, timeData, nbVideoCreation);
	}
	
}

function setSplitNew(_indexSplit, _timeData, _maxSplits) {
	var delta = _timeData[0];
	initialTime = _timeData[1];
	finalTime = _timeData[2];

	if ((micVolume >= _indexSplit * volumeThreshold) && (micVolume < (_indexSplit+1) * volumeThreshold)) {
		dealWithSplits (_indexSplit, _maxSplits, delta);
	}
}


function dealWithSplits (_indexSplit, _maxSplits, _delta){
	for (var i = 0; i < _maxSplits; i++) {
		if (_indexSplit == i){
			volumeTimers[i] = increaseTime(volumeTimers[i], _delta);
			if (volumeTimers[i] > volumeDeadBand){
				var sprite = "#sprite-" + String(i);
				$(sprite).fadeIn().delay(500).next(fadeOutAllVideosButOne(i,_maxSplits,"#sprite-"));
			}	
		}
		else
		{
			volumeTimers[i] = 0;
		}	
	}
}
 
function fadeOutAllVideosButOne(_indexSplit,_maxSplits, _videoId){
	for (var i = 0; i < _maxSplits; i++) {
		var sprite = _videoId + String(i);
		if (i != _indexSplit){
			$(sprite).hide();
		}
	}
}

//REFACTOR----------------

// function dealWithSplits (_indexSplit, _maxSplits, _delta){
// 	for (var i = 0; i < _maxSplits; i++) {
// 		if (_indexSplit == i){
// 			volumeTimers[i] = increaseTime(volumeTimers[i], _delta);
// 			if (volumeTimers[i] > volumeDeadBand){
// 				fadeOutAllVideosButOne(i,_maxSplits,"#sprite-");
// 			}	
// 		}
// 		else
// 		{
// 			volumeTimers[i] = 0;
// 		}	
// 	}
// }
 
// function fadeOutAllVideosButOne(_indexSplit,_maxSplits, _videoId){
// 	for (var i = 0; i < _maxSplits; i++) {
// 		var sprite = _videoId + String(i);
// 		if (i == _indexSplit){
// 			$(sprite).fadeIn();
// 		}else{
// 			$(sprite).fadeOut();
// 		}
// 	}
// }



