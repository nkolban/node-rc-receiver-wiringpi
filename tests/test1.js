/**
 * http://usejsdoc.org/
 */
console.log("Starting rc-receiver-wiringpi tests");
var rcReceiver = require("../src/rc-receiver-wiringpi");
var parms = [
  {channel: 1, pin: 19},
  {channel: 2, pin: 26, map: [20, 80], invert: true}
];
console.log("About to init: %j", parms);
rcReceiver.init(parms);

console.log("Setting up polling");
setInterval(function() {
  var values = rcReceiver.getValues();
  console.log("Retrieved values: %j", values);
}, 2000);
// End of file