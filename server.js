var http = require('http');
var io = require('socket.io');
var express = require('express');
var body_parser = require('body-parser');

var app = express();
var server = http.Server(app);
var io_server = io(server);


io_server.on('connect', function (socket){
    var id = socket.id;
    console.log("Connection started: " + id);
    socket.on('disconnect', function (socket){
        console.log("Connection terminated: " + id);
    });
});


io_server.use(function (socket, next){
    topics = socket.handshake.query.topics;
    if(topics){
        topics.split(",").forEach(function (topic){
            console.log("Joining " + socket.id + " to " + topic);
            socket.join(topic);
        });
    }
    next();
});

app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

app.get('/send/:topic', function (request, response){
    response.setHeader("content-type", "text/html");
    response.end('<form method="POST"><textarea name="testdata"></textarea><input type="submit"></form>');
});

app.post('/send/:topic', function (request, response){
    var topic = request.params['topic'];
    console.log("Sending to " + topic);
    io_server.to(topic).emit("updates", request.body);
    response.end("Sent");
});

server.listen(3000);
console.log("Waiting on port 3000");