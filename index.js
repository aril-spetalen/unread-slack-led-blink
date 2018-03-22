const token = process.env.SLACK_BOT_TOKEN
const blink = require('./blink')
const slack = require('slack')

// Related to the POST request users.counts
let querystring = require('querystring');
let requestPromise = require('request-promise');
let form = {
  token: token,
  mpim_aware: true,
  only_relevant_ims: true,
  simple_unreads: true
};
let formData = querystring.stringify(form);
let contentLength = formData.length;

// State
let usersCounts;

let maxChannelLevel = (channels) => {
  slack.channels.list({token, exclude_archived: true}).then(console.log);
  channels.forEach(function (channel) {
    if (channel.is_archived === false && channel.is_member === true && channel.unread_count > 0) {
      blink.blinkGreen();
      console.log("info: unreads in " + channel.name);
    }
    if (channel.name === 'andromeda'  && channel.unread_count > 0) {
      blink.redWarning();
      console.log("warn: unreads in " + channel.name);
    }
    if (channel.name === 'andromeda') {
      blink.redWarning();
      console.log(channel);
    }
  });
}

let blinkForChannels = (channels) => {
  channels.forEach(function (channel) {
    //console.log(`channel.name: ${channel.name}`);
    if (channel.is_archived === false && channel.is_member === true && channel.unread_count > 0) {
      blink.blinkGreen();
      console.log("info: unreads in " + channel.name);
    }
    if (channel.name === 'andromeda'  && channel.unread_count > 0) {
      blink.redWarning();
      console.log("warn: unreads in " + channel.name);
    }
    if (channel.name === 'andromeda') {
      blink.redWarning();
      console.log(channel);
    }
  });
}

let blinkForGroups = (groups) => {
  let level = 0;
  groups.forEach(function (group) {

    //console.log(`group.name: ${group.name}`);
    if (group.is_archived === false && group.is_member === true) {
      if (group.name === 'andromeda') {
        //console.log(group);
      }

      if ((group.name === 'andromeda' || group.name === 'avspiller') && group.has_unreads === true) {
        level = 3;
        console.log(group);
        console.log("warn: unreads in " + group.name);
      } else if (group.mention_count > 0) {
        level = 3;
        console.log("warn: mentions in " + group.name);
      } else if (group.has_unreads) {
        level = Math.max(level, 2);
        console.log("info: unreads in " + group.name);
      }
    }
  });
  if (level === 3) {
    console.log('level 3, red blink')
    blink.redWarning();
  } else if (level === 2) {
    console.log('level 2, green blink')
    blink.blinkGreen();
  }
  return level;
}

// in this loop, read actual groups and channels, then
// blink according to unread_count and unread_mentions.
let loop = () => {

  let interval = setInterval(() => {
    let maxLevel = 0;
    console.log(new Date());
    // slack.channels.list({token, exclude_archived: true}).then(console.log);
    //console.log(JSON.parse(usersCounts));
    //};

    // Main: Initial request for users.counts. Then enter loop.
    //let getUsersCounts =  () => {
    requestPromise({
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      uri: 'https://nrk.slack.com/api/users.counts',
      body: formData,
      method: 'POST'
    }, function (err, res, body) {
      console.log('successfull response from requestPromise(slack.users.counts)')
      usersCounts = body;
      return body;
    }).then(function (body) {
      //console.log(body)
      let response = JSON.parse(body);
      maxLevel = Math.max(maxLevel, blinkForGroups(response.groups));
      //  blinkForChannels(response.channels);
    }).catch(function (err) {
      // API call failed...
      console.log('caught an exception from requestPromise(slack.users.counts)')
      console.log(err);
    })
    //}
  }, 25000);
};

loop();
