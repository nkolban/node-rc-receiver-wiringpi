/**
 * rc-receiver-wiringpi module
 */
var wpi = require('wiring-pi');

// The set of channels that we are watching.  Each channel contains a record of the form:
//
//  {
//    channel: <channelNumber>,
//    pin:     <GPIO pin number>,
//    invert:  <true/false>,             // Optional
//    map:     [<lowValue>, <highValue>] // Optional
//  }
//
var channels = [];

/**
 * PRIVATE
 * Map
 * @param inValue - The input value
 * @param in_min - The minimum input value
 * @param in_max - The maximum input value
 * @param out_min - The minimum output value
 * @param out_max - The maximum output value
 * @returns The input value mapped to the output value
 */
function map( inValue,  in_min,  in_max, out_min, out_max){
  return (inValue - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

/**
 * PUBLIC
 * init
 * Define the set of channels we are going to be watching.  The input is an array
 * of channel descriptors of the form:
 * {
 *   channel: <channelNumber>,
 *   pin:     <GPIO pin number>,
 *   invert:  <true/false>,             // Optional
 *   map:     [<lowValue>, <highValue>] // Optional
 * }
 */
module.exports.init = function(iChannels) {
  wpi.setup('gpio');
  channels = iChannels;
  // Setup all the channels as GPIO inputs
  channels.forEach(function(currentChannel) {
    wpi.pinMode(currentChannel.pin, wpi.INPUT);
  });
}; // End of init()


/**
 * PUBLIC
 * getValues
 * Return an array of results from decoding the channels.  Each result is of the format:
 * {
 *   channel: <channel number>
 *   value: <value>
 * }
 */
module.exports.getValues = function() {
  var results = []; // The array of results to be returned.
  channels.forEach(function(currentChannel) {
    var value = wpi.pulseIn(currentChannel.pin, wpi.HIGH);
    // The value of a PWM pulse is between 1000 (low) and 2000 (high)
    value = Math.round((value-1000)/1000 * 100);
    if (currentChannel.map) {
      value = map(value, 0, 100, currentChannel.map[0], currentChannel.map[1]);
    }
    if (currentChannel.invert) {
      if (currentChannel.map) {
        value = currentChannel.map[1] - value;
      } else {
        value = 100 - value;
      }
    }
    // Add the current channel details to the return array.
    results.push({channel: currentChannel.channel, value: value});    
  });
  return results;
}; // End of getValues()

// End of file