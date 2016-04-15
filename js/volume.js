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
	var isCountingDown;
	var countDownTime = 2000;
	var nbVolumeSteps = 0;
	var volumeStepId = 0;
	var videoStepId = 0;
	var listeningVolumeStepId = true;
	var planetIdtoPlay;
	var videoDuration;

	function volume() {


		socket.on('newConfig', newConfig);

		function newConfig(_data) {
			volumeStepThreshold = _data.VOLUME_THRESHOLD;
			volumeMin = _data.VOLUME_MIN;
			nbVolumeSteps = _data.NB_VIDEO_CREATION;
			videoStepThreshold = _data.VIDEO_THRESHOLD;
			videoDuration = _data.VIDEO_DURATION;

		}


		function getInstalVolume() {
			var array = new Uint8Array(analyser.frequencyBinCount);

			analyser.getByteFrequencyData(array);
			micVolume = Math.round(getAverageVolume(array));
			isLoudEnough = volumeIsLoudEnough(micVolume, volumeMin);

			getInstalTimeOverVolumeMin();

			getInstalVolumeStepId();

			if (DEBUG) {
				timer.innerHTML = timeOverVolumeMin;
				volumeIn.innerHTML = micVolume;
				phase.innerHTML = volumeStepId;
			}


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
				if (timeOverVolumeMin >= videoDuration) {
					timeOverVolumeMin = videoDuration;
				} else {

					timeOverVolumeMin = getTimeOverVolumeMin(timeOverVolumeMin);
				}
				clearTimeout(countingDown);
				isCountingDown = false;
			} else {
				if (!isCountingDown) {
					isCountingDown = true;

					sendStopVideo();
				}
				if (timeOverVolumeMin > 0) {
					//continue to increment time while counting down in order to 
					//match with the video avancement
					if (timeOverVolumeMin >= videoDuration) {
						timeOverVolumeMin = videoDuration;
					} else {

						timeOverVolumeMin = getTimeOverVolumeMin(timeOverVolumeMin);
					}
				}

			}
		}

		function sendStopVideo() {
			countingDown = setTimeout(
				function() {
					planetIdtoPlay = getPlanetId();
					// console.log({videoStepId,planetIdtoPlay, timeOverVolumeMin, volumeStepId})
					timeOverVolumeMin = 0;
					socket.emit('stopVideo', planetIdtoPlay);
					clearTimeout(countingDown);

				}, countDownTime);

		}

		function volumeIsLoudEnough(_volumeIn, _volumeThreshold) {
			if (_volumeIn > _volumeThreshold) {
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
			getInstalVolume: getInstalVolume,
			listeningVolumeStepId: listeningVolumeStepId,
			planetIdtoPlay: planetIdtoPlay,
			videoStepId: videoStepId,
		}
	}
	return volume;
})(window);