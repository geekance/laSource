var array = new Uint8Array(analyser.frequencyBinCount);

function getVolumeState(_volume) {
	analyser.getByteFrequencyData(array);
	_volume.micVolume = Math.round(getAverageVolume(array));
	_volume.isLoudEnough = volumeIsLoudEnough(_volume.micVolume, _volume.volumeStep);

	volume.innerHTML = Math.round(getAverageVolume(array));
	
}

function volumeIsLoudEnough(_volumeIn, _volumeThreshold){
	if (_volumeIn > _volumeThreshold) {
		return true;
	}
	else{
		return false;
	}
}

function getAverageVolume(array) {
	var values = 0;
	var average;
	var length = array.length;
	// get all the frequency amplitudes
	for (var i = 0; i < length; i++) {
		values += array[i];
	}
	average = values / length;
	return average;
}

