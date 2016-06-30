var IOClient = require('socket.io-client');
var exec = require('child_process').exec;
var fs = require('fs');
var buffer_on = new Buffer([ 255, 1, 1]);
var buffer_off = new Buffer([ 255, 1, 0]);
var connection = IOClient("ws://jessies.personal.jcarter.uk0.bigv.io:4567", {'transports': ['websocket']});

connection.on('connect', function(){
    console.log("connected");
    //console.log(connection);
});

connection.on('disconnect', function(){
    console.log("lost connection");
});

connection.on('updates', function(data){
    console.log("MESSAGE RECEIVED");
    console.log(data);

    try {
      var wstream = fs.createWriteStream('/dev/ttyUSB0');
      wstream.write(buffer_on);
      setTimeout(function() {
        wstream.write(buffer_off);
        wstream.end;
      }, 200);
    }
    catch (e) {
      console.log(e);
    }
});
