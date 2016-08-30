/*jslint node: true */
'use strict';

/*
    Class to control the hammer over GPIO.
    Exposes extend and retract functions to perform those actions.
*/
module.exports = function Hammer(pin) {
    var gpio,
        output_on = 0,
        output_off = 1,
        initial_output = output_off;

    pin = pin || 16;

    // Import the GPIO library (which won't work unless installed separately)
    try {
        gpio = require('pi-gpio');
    } catch (error) {
        console.error("GPIO library for Raspberry Pi is not installed");
        throw error;
    }

    console.log("Connecting to hammer on pin " + pin);
    // Close the gpio port first just in case
    gpio.close(pin, function() {  // This should fail if the pin wasn't open
        // Open the pin for output, ready
        gpio.open(pin, "output", function(error) {
            if (error) {
                console.error("Unable to connect to hammer");
                return;
            }
            // Initialize the pin
            gpio.write(pin, initial_output, function(error) {
                if (error) {
                    console.error("Could not initialize the hammer");
                } else {
                    console.log("GPIO hammer setup complete");
                }
            });
        });
    });

    this.extend = function(cb) {
        console.log("pin on");
        gpio.write(pin, output_on, cb);
    };

    this.retract = function(cb) {
        console.log("pin off");
        gpio.write(pin, output_off, cb);
    };
};
