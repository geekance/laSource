var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var client = io.of('/client')
var express = require('express');
var fs = require('fs');
var videoDuration = 10; //duration of the video in seconds
var videoNbPhases = 5; //Number of phases of the videos
var config = {
    "VOLUME_THRESHOLD": 35,
    "VOLUME_MIN": 30,
    "NB_VIDEO_CREATION": 5, 
    "VIDEO_THRESHOLD": videoDuration/videoNbPhases,
}


app.use(express.static(__dirname));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/sound'));
app.use(express.static(__dirname + '/img'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');

});
app.get('/v', function(req, res) {

  res.sendFile(__dirname + '/indexVideo.html');
  console.log(__dirname + '/indexVideo.html')
});

client.on('connection', function(socket) {
  socket.emit('newConfig', config)

  console.log("new client");

  socket.on('instalVolumeStepId', function(phaseId, planetId) {
    client.emit("instalVolumeStepId", phaseId, planetId)
  })

  socket.on('stopVideo', function(planetId) {
    client.emit("stopVideo", planetId)
  })

  socket.on('disconnect', function(socket) {
    console.log("client disconnect");
  })
});

http.listen(5000, function() {
  console.log('listening on *:5000' + __dirname);
});

// fs.readFile(__dirname+'/videoList.txt', function(err, data) {
//     if(err) throw err;
//     var videoListArray = data.toString().split("\n");
//       io.emit("videoList", videoListArray);
// });