var IOClient = require('socket.io-client');
var exec = require('child_process').exec;
var fs = require('fs');
var connection = IOClient("ws://jessies.personal.jcarter.uk0.bigv.io:4567", {'transports': ['websocket']});

function trigger(){
    var buffer_on = new Buffer([ 255, 1, 1]);
    var buffer_off = new Buffer([ 255, 1, 0]);
    try {
        var wstream = fs.createWriteStream('/dev/ttyUSB0');
        wstream.write(buffer_on);
        setTimeout(function() {
            wstream.write(buffer_off);
            wstream.end();
        }, 200);
    }
    catch (e) {
        console.log("Error with trigger.");
        console.log(e);
    }
}

function connect(url, topics){
    var opts = {
        'transports': ['websocket'],
        'query': {'topics': topics}
    };
    var connection = IOClient(url, opts);

    connection.on('connect', function(){
        console.log("Connected to " + url);
    });

    connection.on('disconnect', function(){
        console.log("Lost connection to " + url);
    });

    connection.on("updates", function(data){
        console.log("MESSAGE RECEIVED");
        console.log(data);
        trigger()
    });
}

connect("ws://jessies.personal.jcarter.uk0.bigv.io:4567", ["bob", "sally"]);
