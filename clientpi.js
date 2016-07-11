var IOClient = require('socket.io-client');
var Hammer = require('./lib/pihammer');
var Trigger = require('./lib/trigger');

/*
    Function to set the whole darn thing up.
    Creates a socket.io connection to the url, asks the server to receive
    events for the topics, and calls the trigger function when those event
    occur on the server.
*/
function connect(url, topics, trigger){
    var opts = {
        'transports': ['websocket'],
        'query': {'topics': topics}
    };
    var connection = IOClient(url, opts);
    var url_tested = false;

    connection.on('connect', function(){
        console.log("Connected to " + url);
        url_tested = true;  // So we can tell if the URL was ever valid
    });

    connection.on('disconnect', function(){
        console.log("Lost connection to " + url);
    });

    connection.on('updates', function(data){
        console.log("MESSAGE RECEIVED");
        console.log(data);
        trigger();  // Fire the hammer!!!
    });

    // Let the user know if the connection cannot be made
    connection.on('connect_error', function(error){
        console.log("Connection error.");
        console.log(error);
        // Has the connection dropped, or did it never work to begin with?
        if(!url_tested){
            console.log("URL might not be valid. Please try again.");
            process.exit(2);
        }
    });
}

/*
    Function to read in the command line args and start the client.
*/
(function start(){
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
}());