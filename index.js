const token = process.env.SLACK_BOT_TOKEN
const slack = require('slack')
const bot = new slack({token})
const blinkstick = require('blinkstick'),
      device = blinkstick.findFirst();

let blink = () => {
  if (device) {
    var finished = false;

    device.blink('red', {'delay':100, 'repeats': 5}, function() {
      device.blink('green', {'delay':50, 'repeats': 10}, function() {
        device.blink('blue', {'delay':25, 'repeats': 20}, function() {
          finished = true;
        });
      });
    });

    var wait = function () { if (!finished) setTimeout(wait, 100)}
    wait();
  }
}

// if (device) {
//   var finished = false;
//   device.blink('red', {'delay':100, 'repeats': 5}, function() {
//     device.blink('green', {'delay':50, 'repeats': 10}, function() {
//       device.blink('blue', {'delay':25, 'repeats': 20}, function() {
//         finished = true;
//       });
//     });
//   });
//
//   var wait = function () { if (!finished) setTimeout(wait, 100)}
//   wait();
// }


// slack.api.test({hello:'world'}, console.log)

// // :new: opt into promises
//slack.api.test({nice:1}).then(console.log).catch(console.log)


// slack.users.list({token}).then(console.log);
//slack.users.profile.get({token}).then(console.log);
//slack.reminders.list({token}).then(console.log);
// slack.channels.list({token, exclude_archived: true}).then(console.log);
// slack.mpim.list({token}).then(console.log);
// slack.conversations.history({token}).then(console.log);
// blink();

// retrieve history from a channel, given its ID
// andromeda: 'G38823PAS' G38823PAS
// avspiller: 'C0DG5695K'
// slack.channels.history({token, channel: 'C0DG5695K', unreads: true}).then(console.log); // avspiller

async function checkChannelHistory(channel='C0DG5695K') {
    let channelHistory = await slack.channels.history({token, channel, unreads: true}); // avspiller
    // console.log(channelHistory); // to log the full output from the channel history.

    // s = JSON.parse(channelHistory);
    // console.log(s[0].type);
    if(channelHistory.ok === true) {
      channelHistory.messages.forEach(function(msg) {
        let written = new Date(parseFloat(msg.ts)*1000);
        let now = new Date();
        if (msg.unread_count > 0) { // dette funker dessverre ikke som forventet - er alltid lik antall svar i tråden
          console.log(Date(parseFloat(msg.tsi*1000)));
          console.log('Uleste meldinger:');
          console.log(msg.text);
          blink();
        }
      });
    }
}
checkChannelHistory('C0DG5695K'); // avspiller


// Inspired from the webpage nrk.slack.com, it's tempting to do:
// slack.users.counts({token, id:"2119db75-1521140400.611"}).then(console.log);
// but this API call does not exist.
