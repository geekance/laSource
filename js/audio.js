function error() {
    alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    mediaStreamSource.connect(analyser);
    main();
    if (DEBUGCANVAS) { // This draws the current waveform, useful for debugging
        debugCaneva();
    }
    updateAnalysers();
    getInputVolume();
}

function getFrequency(fftIndex) {
    return fftIndex*audioContext.sampleRate/analyser.fftSize

}


function getFFTIndex(frequency) {
    return Math.ceil(frequency*analyser.fftSize/audioContext.sampleRate)

}

function updateAnalysers(time) {

    var frequencysSplits = [];
    frequencysSplits[0] = getFFTIndex(50); //50
    frequencysSplits[1] = getFFTIndex(120); //70
    frequencysSplits[2] = getFFTIndex(240); //120
    frequencysSplits[3] = getFFTIndex(500); //260
    frequencysSplits[4] = getFFTIndex(1000); //500
    frequencysSplits[5] = getFFTIndex(2000); 
    frequencysSplits[6] = getFFTIndex(4000); 
    frequencysSplits[7] = getFFTIndex(8000); 
    frequencysSplits[8] = getFFTIndex(16000); 
    frequencysSplits[9] = getFFTIndex(20000); 

    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 100;
        var BAR_WIDTH = 100;
        var numBars = 10;
        var freqByteData = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteFrequencyData(freqByteData); 
        

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
        var multiplier = analyser.frequencyBinCount / numBars;
        var k = 0;
        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            if (k > 0)
            {
                var offset = frequencysSplits[k-1]+1;
                var delta = frequencysSplits[k]-frequencysSplits[k-1];
            }
            else
            {
                var offset = 0;
                var delta = frequencysSplits[k];
            }
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 1; j<= delta; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / delta;
            analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
            var id = String(k);
            var frequencyBand = document.getElementById(id);
            var audio = document.getElementById("audio"+id);
            audio.volume = magnitude/(255*delta);
            frequencyBand.innerHTML = magnitude/(255*delta);

            k = k +1;

        }
    }
    
    rafID = window.requestAnimationFrame( updateAnalysers );
}


function toggleLiveInput() {
    if (isPlaying) {
        //stop playing and return
        sourceNode.stop(0);
        sourceNode = null;
        analyser = null;
        isPlaying = false;
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
        window.cancelAnimationFrame(rafID);
    }
    getUserMedia({
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
            },
            "optional": []
        },
    }, gotStream);
}