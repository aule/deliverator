var IOClient = require('socket.io-client');
var Hammer = require('./lib/hammer');
var Trigger = require('./lib/trigger');

function connect(url, topics, trigger){
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
    var args = process.argv.slice(),
        node = args.shift(),
        script = args.shift(),
        url = args.shift(),
        topics = args,
        hammer = new Hammer("/dev/ttyUSB0"),
        trigger = new Trigger(hammer);

    if(!url){
        console.log("Usage: " + node + " " + script + " <url> <topic> [... <topic>]");
        process.exit(1);
    }
    connect(url, topics, trigger);
}

start();