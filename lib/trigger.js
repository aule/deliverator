/*jslint node: true */
'use strict';

/*
    Factory to create a triggering function for a hammer.
    When called, this function will extend and retract the hammer.
    If called when the hammer is already moving, the request will be queued
    until all previous triggers have completed. If the too many requests are
    queued up then subsequent requests will be ignored.
    The opts parameter can be used to override the extend and retract timings
    and the max queue length;
*/
module.exports = function trigger_factory(hammer, opts) {
    var triggered = false,
        trigger_count = 0,
        max_trigger_count = (opts && opts.max_trigger_count) || 10,
        extend_time = (opts && opts.extend_time) || 100,
        retract_time = (opts && opts.retract_time) || 200;

    // Starts a movement cycle
    function activate() {
        triggered = true;
        hammer.extend(function(err) {
            if (!err) {
                setTimeout(deactivate, extend_time);
            } else {
                finish();  // bail out and tidy up
            }
        });
    }

    // Performs the retraction phase of the cycle
    function deactivate() {
        hammer.retract(function(err) {
            if (!err) {
                setTimeout(finish, retract_time);
            } else {
                finish();  // bail out and tidy up
            }
        });
    }

    // Finishes the cycle, and either unlocks the trigger or begins a new cycle
    function finish() {
        if (trigger_count) {
            trigger_count--;
            activate();  // more to do - keep going!
        } else {
            triggered = false;
        }
    }

    return function() {
        if (triggered) {
            // There is already a cycle activated.
            trigger_count++;
            if (trigger_count > max_trigger_count) {
                console.log("Triggered too many times. Ignoring.");
                trigger_count = max_trigger_count;
            }
        } else {
            // No cycle is going, we need to start one.
            activate();
        }
    }
}
