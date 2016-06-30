var http = require('http');
var IOServer = require('socket.io');

var server = http.createServer();
var io_server = new IOServer(server);

server.on('request', function (request, response){
    console.log(request.url)
    if(request.url == '/send'){
        io_server.emit("updates", {"message": "Moo"});
        response.end("Sending");

    }
});

io_server.on('connect', function (socket){
    console.log("Connection started");
    socket.emit("updates", {"message": "OI!"});
});

server.listen(4567);
console.log("Waiting on port 4567");
