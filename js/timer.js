//Timer Variable
var initialTime = 0;
var finalTime = 0;
var phaseTime = 4;
var timerResetCountDown = 3000;
var timeDelta = getDeltaBetweenTimes();

window.requestAnimationFrame(getDeltaBetweenTimes);

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

function increaseTime(_time, _delta) {
	_time = addTimeDelta(_delta, _time);
	return _time;
}

function decreaseTime(_speedFactor, _time, _delta) {
	if (_time > 0) {
		_time = removeTimeDelta(_speedFactor * _delta, _time);
	}
	return _time;
}

function getDeltaBetweenTimes() {
	if (initialTime === 0) {
		finalTime = Date.now();
	}
	initialTime = finalTime;
	finalTime = Date.now();
	timeDelta = getTimeDelta(initialTime, finalTime);
}

function getTimeOverVolumeMin(_time) {
	return increaseTime(_time, timeDelta);


	// timer.innerHTML = Math.round(time);
}