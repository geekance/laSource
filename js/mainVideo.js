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
var inSession = false;
var countDownBelowVolThreshold = 0;
var planetIsPlayed = false;
var planetId;
var a = [];

socket.on('instalVolumeStepId', main);
socket.on('newConfig', newConfig);
socket.on('stopVideo', playPlanet);

v = document.getElementsByTagName("video")[0];

function newConfig(_data) {
	volumeThreshold = _data.VOLUME_THRESHOLD;
	nbVideoCreation = _data.NB_VIDEO_CREATION;
	emptyBody();
}


function emptyBody() {
	$("body").empty();
}

function main(_videoId, _planetId) {

	if (!planetIsPlayed) {

		createVideoBalise(nbVideoCreation);
		fadeOutAllVideosButOne(_videoId, nbVideoCreation, "#sprite-");
	}

}

function fadeOutAllVideosButOne(_indexSplit, _maxSplits, _videoId) {
	for (var i = 1; i <= _maxSplits; i++) {
		var sprite = _videoId + String(i);
		if (i != _indexSplit) {
			$(sprite).fadeOut();
		} else {
			$(sprite).fadeIn()
		}
	}
}

function createVideoBalise(_nbMaxVideo) {
	var idDiv = '';
	if ($('body').is(":empty")) {
		for (var i = 1; i <= _nbMaxVideo; i++) {
			idDiv = "sprite-" + String(i);
			$('body').append('<div id=' + idDiv + '><video id=video' + i + ' controls="no-controls" autoplay muted><source src="videos/video2.webm" type="video/webm" /></video></div>');
		}
		document.getElementById('video1').addEventListener('ended', function() {
			playPlanet("test")
		}, false);
	}
}

function playPlanet(_planetIdtoPlay) {
	var idDiv = '';
	console.log(_planetIdtoPlay);
	emptyBody();
	planetIsPlayed = true;
	$('body').append('<div id=' + _planetIdtoPlay + '><video id=video' + _planetIdtoPlay + ' controls="no-controls" autoplay muted><source src="videos/robin1.mp4" type="video/mp4" /></video></div>');

	document.getElementById('video' + _planetIdtoPlay).addEventListener('ended', function() {
			planetIsPlayed = false;
			emptyBody();
		}, false);
}

//REFACTOR2----------------

// function dealWithSession(_timeData) {
// 	if (inSession) {
// 		inSession = false;
// 		countDownBelowVolThreshold = 3;
// 	} else {
// 		countDownBelowVolThreshold = decreaseTime(1, countDownBelowVolThreshold, _timeData[0])
// 		if (countDownBelowVolThreshold < 1) {
// 			removeVideoBalise(nbVideoCreation, "Sprite-");
// 		}

// 	}

// }

// function setSplitNew(_indexSplit, _timeData, _maxSplits) {
// 	var delta = _timeData[0];
// 	initialTime = _timeData[1];
// 	finalTime = _timeData[2];

// 	if ((micVolume >= _indexSplit * volumeThreshold) && (micVolume < (_indexSplit + 1) * volumeThreshold)) {
// 		if (!inSession) {
// 			inSession = true;
// 			createVideoBalise(nbVideoCreation);
// 		}
// 		dealWithSplits(_indexSplit, _maxSplits, delta);
// 	}
// }

// function dealWithSplits(_indexSplit, _maxSplits, _delta) {
// 	for (var i = 1; i <= _maxSplits; i++) {
// 		if (_indexSplit == i) {
// 			volumeTimers[i] = increaseTime(volumeTimers[i], _delta);
// 			if (volumeTimers[i] > volumeDeadBand) {
// 				var sprite = "#sprite-" + String(i);
// 				$(sprite).fadeIn().next(fadeOutAllVideosButOne(i, _maxSplits, "#sprite-"));
// 			}
// 		} else {
// 			volumeTimers[i] = 0;
// 		}
// 	}
// }



// function killAllVideos(_maxSplits, _videoId) {
// 	for (var i = 1; i <= _maxSplits; i++) {
// 		var sprite = _videoId + String(i);
// 		$(sprite).fadeout();
// 	}
// 	$("body").empty();
// }

//REFACTOR----------------

// function setSplitNew(_indexSplit, _timeData, _maxSplits) {
// 	var delta = _timeData[0];
// 	initialTime = _timeData[1];
// 	finalTime = _timeData[2];

// 	if ((micVolume >= _indexSplit * volumeThreshold) && (micVolume < (_indexSplit+1) * volumeThreshold)) {
// 		dealWithSplits (_indexSplit, _maxSplits, delta);
// 	}
// }

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