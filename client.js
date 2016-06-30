var IOClient = require('socket.io-client');
var exec = require('child_process').exec;
var fs = require('fs');
var connection = IOClient("ws://jessies.personal.jcarter.uk0.bigv.io:4567", {'transports': ['websocket']});

function trigger(){
    var buffer_on = new Buffer([ 255, 1, 1]);
    var buffer_off = new Buffer([ 255, 1, 0]);
    try {
        var wstream = fs.createWriteStream('/dev/ttyUSB0');
        wstream.on('error', function(error){
            console.log("Error with trigger stream.");
            console.log(error);
        })
        wstream.write(buffer_on);
        setTimeout(function() {
            wstream.write(buffer_off);
            wstream.end();
        }, 200);
        console.log("lsdfol");
    } catch (e) {
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
    var url_tested = false;

    connection.on('connect', function(){
        console.log("Connected to " + url);
        url_tested = true;
    });

    connection.on('disconnect', function(){
        console.log("Lost connection to " + url);
    });

    connection.on('updates', function(data){
        console.log("MESSAGE RECEIVED");
        console.log(data);
        trigger();
    });

    connection.on('connect_error', function(error){
        console.log("Connection error.");
        console.log(error);
        if(!url_tested){
            console.log("URL might not be valid. Please try again.");
            process.exit(2);
        }
    });
}

function start(){
    var args = process.argv.slice();
    var node = args.shift();
    var script = args.shift();
    var url = args.shift();
    var topics = args;
    if(!url){
        console.log("Usage: " + node + " " + script + " <url> <topic> [... <topic>]");
        process.exit(1);
    }
    connect(url, topics);
}

start();