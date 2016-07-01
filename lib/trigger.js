'use strict';

module.exports = function Trigger(hammer, opts){
    var triggered = false,
        trigger_count = 0,
        max_trigger_count = (opts && opts.max_trigger_count) || 10,
        extend_time = (opts && opts.extend_time) || 200,
        retract_time = (opts && opts.retract_time) || 500;

    function activate(){
        triggered = true;
        hammer.extend(function(err){
            if(!err){
                setTimeout(deactivate, extend_time);
            } else {
                finish();
            }
        });
    }

    function deactivate(){
        hammer.retract(function(err){
            if(!err){
                setTimeout(finish, retract_time);
            } else {
                finish();
            }
        });
    }

    function finish(){
        if(trigger_count){
            trigger_count--;
            activate();
        } else {
            triggered = false;
        }
    }

    return function(){
        if(triggered){
            trigger_count++;
            if(trigger_count > max_trigger_count){
                console.log("Triggered too many times. Ignoring.");
                trigger_count = max_trigger_count;
            }
        } else {
            activate();
        }
    }
}