//bypass for debug
var instal = instal || {};
instal.volume = (function(window, undefined) {
	var volumeStepThreshold = 0;
	var videoStepThreshold = 0;
	var volumeMin = 0;
	var micVolume = 0;
	var isLoudEnough = false;
	var timeOverVolumeMin = 0;
	var countingDown;
	var isCountingDown = true;
	var countDownTime = 2000;
	var nbVolumeSteps = 0;
	var volumeStepId = 0;
	var videoStepId = 0;
	var listeningVolumeStepId = true;
	var planetIdtoPlay = null;
	var videoDuration;
	var array = new Uint8Array(analyser.frequencyBinCount);

	function volume() {


		socket.on('newConfig', newConfig);
		socket.on('videoCurrentTime', setTimeOverVolumeMin);

		function newConfig(_data) {
			volumeStepThreshold = _data.VOLUME_THRESHOLD;
			volumeMin = _data.VOLUME_MIN;
			nbVolumeSteps = _data.NB_VIDEO_CREATION;
			videoStepThreshold = _data.VIDEO_THRESHOLD;
			videoDuration = _data.VIDEO_DURATION;

		}

		function setTimeOverVolumeMin(_videoCurrentTime) {
			timeOverVolumeMin = _videoCurrentTime;
		}

		function getInstalVolumeStates() {


			analyser.getByteFrequencyData(array);

			micVolume = Math.round(getAverageVolume(array));

			isLoudEnough = volumeIsLoudEnough(micVolume, volumeMin);

			getInstalTimeOverVolumeMin();

			getInstalVolumeStepId();

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


		function getInstalVolumeStepId() {
			if (!isLoudEnough) {
				return
			}
			if (listeningVolumeStepId) {
				volumeStepId = Math.round((1 / volumeStepThreshold) * micVolume);
				listeningVolumeStepId = false;

				if (volumeStepId > nbVolumeSteps) {
					volumeStepId = nbVolumeSteps;
				}
				socket.emit('instalVolumeStepId', volumeStepId);

				setTimeout(
					function() {
						listeningVolumeStepId = true;
					}, countDownTime);
			}
		}

		function getInstalTimeOverVolumeMin() {
			if (isLoudEnough) {
				clearTimeout(countingDown);
				isCountingDown = false;
			} else {
				if (!isCountingDown) {
					isCountingDown = true;
					sendStopVideo();
				}

			}
		}

		function sendStopVideo() {
			countingDown = setTimeout(
				function() {
					planetIdtoPlay = getPlanetId();
					timeOverVolumeMin = 0;
					socket.emit('stopVideo', planetIdtoPlay);
					clearTimeout(countingDown);

				}, countDownTime);

		}

		function volumeIsLoudEnough(_volumeIn, _volumeMin) {
			if (_volumeIn > _volumeMin) {
				return true;
			} else {
				return false;
			}
		}

		function getVideoStep() {
			return Math.round((1 / videoStepThreshold) * timeOverVolumeMin);
		}

		function getPlanetId() {
			videoStepId = getVideoStep();
			return videoStepId + "_" + volumeStepId;
		}

		function getAverageVolume(_array) {
			var values = 0;
			var average;
			var length = _array.length;
			// get all the frequency amplitudes
			for (var i = 0; i < length; i++) {
				values += _array[i];
			}
			average = values / length;
			return average;
		}

		return {
			isLoudEnough: isLoudEnough,
			micVolume: micVolume,
			volumeStepId: volumeStepId,
			timeOverVolumeMin: timeOverVolumeMin,
			getInstalVolumeStates: getInstalVolumeStates,
			listeningVolumeStepId: listeningVolumeStepId,
			planetIdtoPlay: planetIdtoPlay,
			videoStepId: videoStepId,
		}
	}
	return volume;
})(window);