//Audio Variable
var analyserContext = null;
var mediaStreamSource = null;
var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();
var freqByteData = new Uint8Array(analyser.frequencyBinCount);
var SPACING = 100;
var BAR_WIDTH = 100;
var numBars = 10;
var magnitude = 0;
var offset = 0;
var delta = 0;
var frequencyBand = 0;
var micVolume = 0;
var k = 0;
var frequencysSplits = [];
frequencysSplits[0] = getFFTIndex(50); 
frequencysSplits[1] = getFFTIndex(120); 
frequencysSplits[2] = getFFTIndex(240); 
frequencysSplits[3] = getFFTIndex(500); 
frequencysSplits[4] = getFFTIndex(1000); 
frequencysSplits[5] = getFFTIndex(2000);
frequencysSplits[6] = getFFTIndex(4000);
frequencysSplits[7] = getFFTIndex(6000);
frequencysSplits[8] = getFFTIndex(7000);
frequencysSplits[9] = getFFTIndex(8000);

function error() {
    alert('Stream generation failed.');
}

function toggleLiveInput() {
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
    analyser.fftSize = 1024;
    mediaStreamSource.connect(analyser);
    updateAnalysers();
}

function getFFTIndex(frequency) {
    return Math.ceil(frequency * analyser.fftSize / audioContext.sampleRate);

}

function updateAnalysers(time) {
    k = 0;

    analyser.getByteFrequencyData(freqByteData);


    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
    analyserContext.fillStyle = '#F6D565';
    analyserContext.lineCap = 'round';

    // Draw rectangle for each frequency bin.
    for (var i = 0; i < numBars; ++i) {
        magnitude = 0;
        if (k > 0) {
            offset = frequencysSplits[k - 1] + 1;
            delta = frequencysSplits[k] - frequencysSplits[k - 1];
        } else {
            offset = 0;
            delta = frequencysSplits[k];
        }
        // gotta sum/average the block, or we miss narrow-bandwidth spikes
        for (var j = 1; j <= delta; j++)
            magnitude += freqByteData[offset + j];
        magnitude = magnitude / delta;
        analyserContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
        analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        frequencyBand = document.getElementById(String(k));
        audio = document.getElementById("audio" + String(k));
        audio.volume = magnitude / (255 * delta);
        frequencyBand.innerHTML = magnitude / (255 * delta);
        k = k + 1;

    }
    
}

function startAllSOunds(){
    for (var i = 0; i < 10; i++) {
        a = document.getElementById("audio"+String(i));
        a.play();
        a.loop = true;
        a.volume = 0;
    }
}