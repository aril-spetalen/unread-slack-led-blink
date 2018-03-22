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

let blinkForChannels = (channels) => {
  let level = 0;
  channels.forEach(function (channel) {
    //console.log(`channel.name: ${channel.name}`);
    if (channel.is_archived === false && channel.is_member === true) {
      if (channel.name === 'avspiller'  && channel.unread_count > 0) {
        // blink.redWarning();
        level = 3;
        console.log("warn: unreads in " + channel.name);
      } else if (channel.mention_count > 0) {
        // blink.redWarning();
        level = 3;
        console.log("warn: mention in " + channel.name);
      } else if (channel.has_unreads > 0) {
        // blink.blinkGreen();
        console.log("info: unreads in " + channel.name);
        level = Math.max(1, level);
      }
    }
  });
  return level;
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
        // most important if one of 'ps', 'devops', 'nrktv', 'streaming_origin',
        // 'programspiller-test',
        // 'publikumsservice', 'radiospillerfeil', 'tekst-til-nett'
        level = Math.max(level, 2);
        console.log("info: unreads in " + group.name);
      }
    }
  });
  return level;
}

let blinkForIms = (instantMessages) => {
  let level = 0;
  instantMessages.forEach(function (im) {
    // console.log(`im.name: ${im.name}`);
    if (im.has_unreads === true) {
      level = 3;
      console.log("warn: unread IM from " + im.name);
    }
  });
  return level;
}

let blinkForMpims = (MPInstantMessages) => {
  let level = 0;
  MPInstantMessages.forEach(function (mpim) {
    // console.log(`mpim.name: ${mpim.name}`);
    if (mpim.is_archived === false && mpim.is_member === true) {
      if (mpim.mention_count > 0) {
        level = 3;
        console.log(mpim);
        console.log("warn: mention in " + mpim.name);
      } else if (mpim.unread_count > 0) {
        level = 2;
        console.log("info: unread in " + mpim.name);
      } else if (mpim.has_unreads) {
        // most important if one of 'ps', 'devops', 'nrktv', 'streaming_origin',
        // 'programspiller-test',
        // 'publikumsservice', 'radiospillerfeil', 'tekst-til-nett'
        level = Math.max(level, 2);
        console.log("info: unreads in " + mpim.name);
      }
    }
  });
  return level;
}


// Read actual groups and channels, then
// blink according to unread messages and mentions.
let loop = () => {

  let interval = setInterval(() => {
    let maxLevel = 0;
    console.log(new Date());

    // Main: Request users.counts.
    requestPromise({
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      uri: 'https://nrk.slack.com/api/users.counts',
      body: formData,
      method: 'POST'
    }, function (err, res, body) {
      // console.log('successfull response from requestPromise(slack.users.counts)')
      return body;
    }).then(function (body) {
      //console.log(body)
      let response = JSON.parse(body);
      maxLevel = Math.max(maxLevel, blinkForGroups(response.groups));
      maxLevel = Math.max(maxLevel, blinkForChannels(response.channels));
      maxLevel = Math.max(maxLevel, blinkForIms(response.ims));
      maxLevel = Math.max(maxLevel, blinkForMpims(response.mpims));


      if (maxLevel === 3) {
        blink.redWarning();
      } else if (maxLevel === 2) {
        blink.blinkGreen();
      } else {
        blink.heartBeat();
      }
    }).catch(function (err) {
      // API call failed...
      console.log('caught an exception from requestPromise(slack.users.counts)')
      console.log(err);
    })
  }, 15000);
};

loop();
