/*jslint node: true */
'use strict';

var yargs = require('yargs');
var IOClient = require('socket.io-client');
var Hammer = require('./lib/hammer');
var PiHammer = require('./lib/pihammer');
var Trigger = require('./lib/trigger');

/*
    Function to set the whole darn thing up.
    Creates a socket.io connection to the url, asks the server to receive
    events for the topics, and calls the trigger function when those event
    occur on the server.
*/
function connect(url, topics, trigger) {
    var opts = {
            'transports': ['websocket'],
            'query': {'topics': topics}
        },
        connection = new IOClient(url, opts),
        url_tested = false;

    console.log("Connecting to server at " + connection.io.uri);

    connection.on('connect', function() {
        console.log("Connected to " + url);
        url_tested = true;  // So we can tell if the URL was ever valid
    });

    connection.on('disconnect', function() {
        console.log("Lost connection to " + url);
    });

    connection.on('updates', function(data) {
        console.log("MESSAGE RECEIVED");
        console.log(data);
        trigger();  // Fire the hammer!!!
    });

    // Let the user know if the connection cannot be made
    connection.on('connect_error', function(error) {
        console.log("Connection error.");
        console.log(error);
        // Has the connection dropped, or did it never work to begin with?
        if (!url_tested) {
            console.log("URL might not be valid. Please check and try again.");
            process.exit(2);
        }
    });
}

/*
    Function to configure the argument parser and return the options
*/
function process_args() {
    var usage = 'Usage: $0 --url <server> [options]\nor\nUsage: $0 --config <file>',
        example = 'Example: $0 -u ws://example.com -h gpio -t topic1 topic2';

    return yargs.usage(usage).epilogue(example)
        .option('config', {
            alias: 'c',
            config: true
        })
        .option("url", {
            alias: 'u',
            describe: 'URL of the triggering server',
            demand: true
        })
        .option('topics', {
            alias: 't',
            describe: 'Topics which trigger the hammer',
            array: true
        })
        .option('hammer', {
            alias: 'h',
            describe: 'Method of connecting to the hammer',
            choices: ['serial', 'gpio'],
            'default': 'serial'
        })
        .option('tty', {
            describe: 'TTY to use for serial connection',
            'default': '/dev/ttyUSB0'
        })
        .option('pin', {
            describe: 'Pin to use for GPIO connection',
            number: true,
            'default': 16
        })
        .option('extend', {
            alias: 'e',
            describe: 'Duration in ms for extending the hammer',
            number: true,
            'default': 300
        })
        .option('retract', {
            alias: 'r',
            describe: 'Duration in ms for retracting the hammer',
            number: true,
            'default': 200
        })
        .option('queuesize', {
            alias: 'q',
            describe: 'Maximum number of queued hammer triggers',
            'default': 10
        })
        .group(['url', 'topic'], "Listening to triggers")
        .group(['hammer', 'tty', 'pin'], "Controlling the hammer")
        .group(['extend', 'retract'], "Hammer timings")
        .help()
        .argv;
}

/*
    Function to load in the configuration and start the client.
*/
(function start() {
    var args = process_args(),
        url = args.url,
        topics = args.topics,
        hammer,
        trigger;

    if (!topics) {
        console.warn("There are no subscribed topics so nothing will be triggered");
    }

    if (args.hammer === 'serial') {
        hammer = new Hammer(args.tty);
    } else {
        hammer = new PiHammer(args.pin);
    }

    trigger = new Trigger(hammer, {
        extend_time: args.extend,
        retract_time: args.retract,
        max_trigger_count: args.queuesize
    })

    connect(url, topics, trigger);
}());
