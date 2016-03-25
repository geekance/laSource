function getInputVolume() {
	var array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);
	var average = Math.round(getAverageVolume(array));
	volume.innerHTML = average;
	
	window.requestAnimationFrame(getInputVolume);
	return average;

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

