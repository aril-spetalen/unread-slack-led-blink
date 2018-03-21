var blinkstick = require('blinkstick'),
    device = blinkstick.findFirst();

let blinkGreen = () => {
  if (device) {
    var finished = false;
    device.blink('green', {'delay':300, 'repeats': 3}, function() {
      device.blink('blue', {'delay':100, 'repeats': 3}, function() {
        device.blink('green', {'delay':300, 'repeats': 3}, function() {
          finished = true;
        });
      });
    });
    var wait = function () { if (!finished) setTimeout(wait, 100)}
    wait();
  }
}

let redWarning = () => {
  if (device) {
    var finished = false;
    device.blink('red', {'delay':300, 'repeats': 5}, function() {
      finished = true;
    });
    var wait = function () { if (!finished) setTimeout(wait, 100)}
    wait();
  }
}

module.exports = {
  blinkGreen,
  redWarning
};
