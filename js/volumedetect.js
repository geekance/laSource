var array = new Uint8Array(analyser.frequencyBinCount);

function getInputVolume() {
	analyser.getByteFrequencyData(array);
	volume.innerHTML = Math.round(getAverageVolume(array));
	
	return volume.innerHTML;
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

