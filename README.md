# rc-receiver-wiringpi

Decode the PWM signal from an RC transmitter/receiver pair.

## install

```
$ npm install rc-receiver-wiringpi
```

## Usage

A radio control (RC) transmitter sends an encoded signal to an RC receiver.  The RC receiver
then decodes the signal and produces a pulse width modulated (PWM) representation of the 
original inputs.  To think about this, consider a joystick like a slider.  When the slider is
at one end, it registers 0, when it is at the other end, it registers 100.  If the slider
is in between the end points, it registers a value proportional to its position.

An RC transmitter commonly has two joysticks with each joystick able to provide two independent
values.  Those values are the amount the joystick is north/south and the amount the joystick is
east/west.  Thus for a transmitter that has two joysticks, there will be a total of four values
at any one time.  Those values being the amount of north/south on joystick 1, the amount of east/west
on joystick 1, the amount of north/south on joystick 2 and the amount of east/west on joystick 2.
Each of these data values is transmitted separately by the transmitter in what is called a
"channel".  The number of channels provided by a transmitter is usually four or more.  The channels
beyond those described may be associated with buttons and toggle switches.

Since an RC transmitter transmits values on a channel, we would expect the corresponding receiver
to receive those channels.  An RC receiver exposes some number of channels on PWM pins.  Note that
the receiver may expose more or less channels than the transmitter transmits.  For example,
a four channel transmitter may be used with a three channel receiver but, obviously, we will lose
one of the channels of information.

When using this package, we connect the signal lines out from the RC receiver into digital
input pins on the Pi.  This module will then examine those pins when requested and tell us the
values currently received from the transmitter.

To use the package, we call:

```
receiver.init([<arrayOfChannels>]);

```

where a channel record is composed of:

```
{
   channel: <channelNumber>,
   pin:     <GPIO pin number>,
   invert:  <true/false>,             // Optional
   map:     [<lowValue>, <highValue>] // Optional
}
```

* The `channel` is our logical channel number.
* The `pin` is the GPIO pin number from which we are reading the PWM signal.
* The `invert` parameter defines whether or not we are inverting the value.
* The `map` parameter maps the value received from the receiver into a low/high range.

Once initialized, we can call `getValues()` to receive an array of values.
Each value will be record of the format:

```
{
   channel: <channelNumber>
   value:   <value>
}
```

The `value` is a numeric in the range 0 to 100.