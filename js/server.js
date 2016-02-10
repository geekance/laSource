var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var fs = require('fs');

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/img'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
    console.log("reload");
    // res.sendfile('idSelec.html');
});

//video array 

http.listen(4000, function() {
console.log('listening on *:4000' + __dirname);
});

//socket.io events
// io.on('connection', function(socket) {
//   console.log("Hello player");
//   io.emit("msg","welcome");


// fs.readFile(__dirname+'/videoList.txt', function(err, data) {
//     if(err) throw err;
//     var videoListArray = data.toString().split("\n");
//       io.emit("videoList", videoListArray);
// });


//   socket.on('disconnect', function(socket) {
//     console.log("bye player");
//   });

});