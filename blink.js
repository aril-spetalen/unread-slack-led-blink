var blinkstick = require('blinkstick-n9'),
    device = blinkstick.findFirst();

let blinkBlue = () => {
  if (device) {
    var finished = false;
    device.blink('blue', {'delay':500, 'repeats': 3}, function() {
      finished = true;
    });
    var wait = function () { if (!finished) setTimeout(wait, 100)}
    wait();
  }
}

let heartBeat = () => {
  if (device) {
    var finished = false;
    device.pulse('green', function() {
      finished = true;
    });
    var wait = function () { if (!finished) setTimeout(wait, 100)}
    wait();
  }
}

let blinkYellow = () => {
  if (device) {
    var finished = false;
    device.blink('yellow', {'delay':500, 'repeats': 3}, function() {
      finished = true;
    });
    var wait = function () { if (!finished) setTimeout(wait, 200)}
    wait();
  }
}

let redWarning = () => {
  if (device) {
    var finished = false;
    device.blink('red', {'delay':500, 'repeats': 5}, function() {
      finished = true;
    });
    var wait = function () { if (!finished) setTimeout(wait, 200)}
    wait();
  }
}

module.exports = {
  blinkBlue,
  blinkYellow,
  redWarning,
  heartBeat
};
