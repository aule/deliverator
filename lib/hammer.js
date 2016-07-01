'use strict';

var fs = require('fs');

/*
    Class to control the hammer over USB.
    Exposes extend and retract functions to perform those actions.
*/
module.exports = function Hammer(device){
    var device_stream,
        buffer_on = new Buffer([ 255, 1, 1]),
        buffer_off = new Buffer([ 255, 1, 0]);

    console.log("Connecting to hammer on " + device);

    // create one connection to the device which can be reused
    device_stream = fs.createWriteStream(device)
    .once("error", function(error){
        console.log("Unable to connect to hammer");
    });

    this.extend = function(cb){
        device_stream.write(buffer_on, cb);
    }

    this.retract = function(cb){
        device_stream.write(buffer_off, cb);
    }
}