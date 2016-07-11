'use strict';

/*
    Class to control the hammer over GPIO.
    Exposes extend and retract functions to perform those actions.
*/
module.exports = function Hammer(pin) {
    var self = this,
        gpio,
        output_on = 1,
        output_off = 0;

    pin = pin || 16;

    // Import the GPIO library (which won't work unless installed separately)
    try {
        gpio = require('pi-gpio');
    } catch (error) {
        console.error("GPIO library for Raspberry Pi is not installed");
        throw error;
    }

    console.log("Connecting to hammer on pin " + pin);

    // Open the pin for output, ready
    gpio.open(pin, "output", function(error) {
        if (error) {
            console.error("Unable to connect to hammer");
        }
    });

    self.extend = function(cb) {
        gpio.write(pin, output_on, cb);
    };

    self.retract = function(cb) {
        gpio.write(pin, output_off, cb);
    };
};