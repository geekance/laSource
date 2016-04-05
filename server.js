var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var client = io.of('/client')
var express = require('express');
var fs = require('fs');
var config = {
    "VOLUME_THRESHOLD": 10,
    "VOLUME_MIN": 5,
    "NB_VIDEO_CREATION": 5 
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
  socket.on('sendMicVolume', function(micVolume, phaseId) {
    client.emit("updateMicVolume", micVolume, phaseId)
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