function getTimeDelta(_initialTime, _finalTime) {
	var delta = _finalTime - _initialTime;
	delta = delta / 1000; //convert in seconds
	return delta;
}

function addTimeDelta(_delta) {
	time = time + _delta;
}

function removeTimeDelta(_delta) {
	time = time - _delta;
}

function increaseTime() {
	var delta = getTimeDelta(initialTime, finalTime)
	addTimeDelta(Math.round(delta));
}

function decreaseTime() {
	var delta = getTimeDelta(initialTime, finalTime)
	removeTimeDelta(Math.round(delta));
}