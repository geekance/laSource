//Timer Variable
var initialTime = 0;
var finalTime = 0;
var phaseTime = 4;
var time = 0; 

function getTimeDelta(_initialTime, _finalTime) {
	var delta = _finalTime - _initialTime;
	delta = delta / 1000; //convert in seconds
	return delta;
}

function addTimeDelta(_delta, _time) {
	_time = _time + _delta;
	return _time;
}

function removeTimeDelta(_delta, _time) {
	_time = _time - _delta;
	return _time;
}

function increaseTime(_time,_delta) {
	_time = addTimeDelta(_delta, _time);
	return _time;
}

function decreaseTime(_speedFactor,_time,_delta) {
	if (_time > 0) {
		_time = removeTimeDelta(_speedFactor*_delta, _time);
	}	
	return _time;
}

function getDeltaBetweenTimes (_initialTime, _finalTime){
	if (_initialTime === 0) {
		_finalTime = Date.now();
	}
	_initialTime = _finalTime;
	_finalTime = Date.now();
	return [getTimeDelta(_initialTime, _finalTime),_initialTime,_finalTime];
}

function dealWithTime(_volumeMin){
	var retuns = getDeltaBetweenTimes(initialTime, finalTime);
	var delta = retuns[0];
	initialTime = retuns[1];
	finalTime = retuns[2];
	
	if (micVolume > _volumeMin) {
		time = increaseTime(time,delta);

	} else {
		time = decreaseTime(2,time,delta);
	}
	timer.innerHTML = Math.round(time);
}