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

// API methods tested OK
// slack.users.list({token}).then(console.log);
// slack.users.profile.get({token}).then(console.log);
// slack.reminders.list({token}).then(console.log);
// slack.channels.list({token, exclude_archived: true}).then(console.log);
// slack.mpim.list({token}).then(console.log);
// slack.conversations.list({token}).then(console.log);

// history from a channel, given its ID
// andromeda: 'G38823PAS' G38823PAS
// avspiller: 'C0DG5695K'
// slack.channels.history({token, channel: 'C0DG5695K', unreads: true}).then(console.log); // avspiller

async function checkChannelHistory(channel='C0DG5695K') {
    let mpimList = await slack.channels.history({token, channel, unreads: true}); // avspiller
    // console.log(mpimList); // to log the full output from the channel history.

    // s = JSON.parse(mpimList);
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
// checkChannelHistory('C0DG5695K'); // avspiller

async function checkMpimList() {
    let mpimList = await slack.mpim.list({token});

    // s = JSON.parse(channelHistory);
    // console.log(s[0].type);
    if(mpimList.ok === true) {
      mpimList.groups.forEach(function(group) {
        let written = new Date(parseFloat(group.ts)*1000);
        let now = new Date();
        if (group.unread_count > 0) { // dette funker dessverre ikke som forventet - er alltid lik antall svar i tråden
          console.log(Date(parseFloat(group.tsi*1000)));
          console.log('Uleste meldinger:');
          console.log(group.text);
          blink();
        }
      });
    }
}
// slack.mpim.list({token}).then(console.log);

async function checkConversationsInfo() {
    let conversationList = await slack.mpim.list({token});
    let numItems = 0;

    // s = JSON.parse(channelHistory);
    // console.log(s[0].type);
    if(conversationList.ok === true) {
      conversationList.groups.forEach(function(conversation) {
        let last_read = new Date(parseFloat(conversation.last_read)*1000);
        numItems += 1;

        // let unread_count = conversation.last_read;
        // console.log(unread_count)
        // let now = new Date();
        if (conversation.name.indexOf('delaval') !== -1) { //
          console.log(conversation);
        }
        // console.log(conversation);

        if (conversation.unread_count > 0) { // dette funker dessverre ikke som forventet - er alltid lik antall svar i tråden
          // console.log(Date(parseFloat(conversation.tsi*1000)));
          console.log('Uleste meldinger:');
          console.log(conversation.latest.text);
          blink();
        }
      });
    };
    console.log(numItems);
}
// checkConversationsInfo();


async function checkImList() {
    let imList = await slack.im.list({token});
    let numItems = 0;

    if(imList.ok === true) {
      imList.ims.forEach(function(im) {
        // let last_read = new Date(parseFloat(im.last_read)*1000);
        numItems += 1;

        // { id: 'D9GULUYTW',
        //   created: 1519916876,
        //   is_im: true,
        //   is_org_shared: false,
        //   user: 'U9GLC9NGK',
        //   is_user_deleted: false,
        //   priority: 0.061903583866865 }

        // if (im.name.indexOf('delaval') !== -1) { //
        //   console.log(im);
        // }
        console.log(im);

        if (im.unread_count > 0) { // dette funker dessverre ikke som forventet - er alltid lik antall svar i tråden
          // console.log(Date(parseFloat(im.tsi*1000)));
          console.log('Uleste meldinger:');
          console.log(im.latest.text);
          blink();
        }
      });
    };
    console.log(numItems);
}
// checkImList();
async function checkUsersCounts() {
    let imList = await slack.users.counts({token});
    let numItems = 0;
console.log(imList);
    if(imList.ok === true) {
      imList.ims.forEach(function(im) {
        // let last_read = new Date(parseFloat(im.last_read)*1000);
        numItems += 1;
        console.log(im);

        if (im.unread_count > 0) { // dette funker dessverre ikke som forventet - er alltid lik antall svar i tråden
          // console.log(Date(parseFloat(im.tsi*1000)));
          console.log('Uleste meldinger:');
          console.log(im.latest.text);
          blink();
        }
      });
    };
    console.log(numItems);
}
checkUsersCounts();

// Inspired from the webpage nrk.slack.com, it's tempting to do:
// slack.users.counts({token, id:"2119db75-1521140400.611"}).then(console.log);
// but this API call does not exist.
