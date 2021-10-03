var blinkstick = require('blinkstick-n9'),
    device = blinkstick.findFirst();

const SHORT = 300;
const LONG = 900;
const PAUSE = 200;

let blink = (duration, color) => {
 return new Promise((resolve, reject) => {
  if (device) {
    device.setColor(color);
    let light = setTimeout ((duration) => {
      clearTimeout(light);
      device.turnOff();
      let dark = setTimeout ((PAUSE) => {
        clearTimeout(dark);
        resolve(`blinking ${duration} ms `);
      }, PAUSE)
    }, duration)
  }
  })
}

let sequence = [LONG, SHORT, SHORT];
const code = {
  'a': [SHORT, LONG],
  'b': [LONG, SHORT, SHORT, SHORT],
  'c': [LONG, SHORT, LONG, SHORT],
  'd': [LONG, SHORT, SHORT],
  'e': [SHORT],
  'é': [SHORT, SHORT, LONG, SHORT, SHORT],
  'è': [SHORT, SHORT, LONG, SHORT, SHORT],
  'f': [SHORT, SHORT, LONG, SHORT],
  'g': [LONG, LONG, SHORT],
  'h': [SHORT, SHORT, SHORT, SHORT],
  'i': [SHORT, SHORT],
  'j': [SHORT, LONG, LONG, LONG],
  'k': [LONG, SHORT, LONG],
  'l': [SHORT, LONG, SHORT, SHORT],
  'm': [LONG, LONG],
  'n': [LONG, SHORT],
  'o': [LONG, LONG, LONG],
  'p': [SHORT, LONG, LONG, SHORT],
  'q': [LONG, LONG, SHORT, LONG],
  'r': [SHORT, LONG, SHORT],
  's': [SHORT, SHORT, SHORT],
  't': [LONG],
  'u': [SHORT, SHORT, LONG],
  'v': [SHORT, SHORT, SHORT, LONG],
  'w': [SHORT, LONG, LONG],
  'x': [LONG, SHORT, SHORT, LONG],
  'y': [LONG, SHORT, LONG, LONG],
  'z': [LONG, LONG, SHORT, SHORT],
  'æ': [SHORT, LONG, SHORT, LONG],
  'ø': [LONG, LONG, LONG, SHORT],
  'å': [SHORT, LONG, LONG, SHORT, LONG],
  '1': [SHORT, LONG, LONG, LONG, LONG],
  '2': [SHORT, SHORT, LONG, LONG, LONG],
  '3': [SHORT, SHORT, SHORT, LONG, LONG],
  '4': [SHORT, SHORT, SHORT, SHORT, LONG],
  '5': [SHORT, SHORT, SHORT, SHORT, SHORT],
  '6': [LONG, SHORT, SHORT, SHORT, SHORT],
  '7': [LONG, LONG, SHORT, SHORT, SHORT],
  '8': [LONG, LONG, LONG, SHORT, SHORT],
  '9': [LONG, LONG, LONG, LONG, SHORT],
  '0': [LONG, LONG, LONG, LONG, LONG]
};

let morse = (letter, color = 'purple') => {
  sequence = code[letter];
  if(sequence.length > 0) {
    blink(sequence[0], color).then(() => {
      if(sequence.length > 1) {
        blink(sequence[1], color).then(() => {
          if(sequence.length > 2) {
            blink(sequence[2], color).then(() => {
              if(sequence.length > 3) {
                blink(sequence[3], color).then(() => {
                  if(sequence.length > 4) {
                    blink(sequence[4], color);
                  }
                });
              }
            });
          };
        });
      };
    });
  }
}

 morse('c', 'blue');

module.exports = {
  morse
};

