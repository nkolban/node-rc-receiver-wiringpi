/**
 * rc-receiver-wiringpi module
 */
var wpi = require('wiring-pi');

// The set of channels that we are watching.  Each channel contains a record of the form:
// {
//   channel: <channel number>,
//   pin:     <pin for the channel>
// }
//
var channels = [];

function map( x,  in_min,  in_max, out_min, out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// init()
// Initialize the library.
//
module.exports.init = function(iChannels) {
  wpi.setup('gpio');
  channels = iChannels;
  // Setup all the channels as GPIO inputs
  channels.forEach(function(currentChannel) {
    wpi.pinMode(currentChannel.pin, wpi.INPUT);
  });
}; // End of init()


// getValues()
// Retrieve the current values of the channels.
//
module.exports.getValues = function() {
  var results = [];
  channels.forEach(function(currentChannel){
    var value = wpi.pulseIn(currentChannel.pin, wpi.HIGH);
    // The value of a PWM pulse is between 1000 (low) and 2000 (high)
    value = Math.round((value-1000)/1000 * 100);
    if (currentChannel.map) {
      value = map(value, currentChannel.map[0], currentChannel.map[1], 0, 100);
    }
    if (currentChannel.invert) {
      value = 100 - value;
    }
    results.push({channel: currentChannel.channel, value: value});    
  });
  return results;
}; // End of getValues()

// End of file