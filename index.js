const token = process.env.SLACK_BOT_TOKEN
const blink = require('./blink')
const samuel = require('./samuel')
const slack = require('slack')
const fetch = require('node-fetch');
// import fetch from 'node-fetch';

// Related to the POST request users.counts
let querystring = require('querystring');
// let requestPromise = require('request-promise');
let form = {
  token: token,
  mpim_aware: true,
  only_relevant_ims: true,
  simple_unreads: true
};
let formData = querystring.stringify(form);
let contentLength = formData.length;
const updateInterval = 15000;

let blinkForChannels = (channels) => {
  let level = 0;
  channels.forEach(function (channel) {
    //console.log(`channel.name: ${channel.name}`);
    if (channel.is_archived === false && channel.is_member === true) {
      if (channel.is_starred === true && channel.has_unreads === true) {
        if (channel.name === 'andromeda' || channel.mention_count > 0) {
          level = 4;
          console.log("warn: unreads in " + channel.name);
        } else {

        // blink.redWarning();
        level = 3;
        console.log("warn: unreads in " + channel.name);
        }
      } else if (channel.mention_count > 0) {
        level = 3;
        console.log("warn: mention in " + channel.name);
      } else if (channel.has_unreads) {
        // blink.blinkBlue();
        console.log("info: unreads in " + channel.name);
        level = Math.max(2, level);
      } 
      //nrktv:{"id":"C6H30RQJH","name":"nrktv","is_archived":false,"is_general":false,"is_muted":false,"is_starred":true,"is_member":true,"name_normalized":"nrktv","has_unreads":true,"latest":"1522746366.000307","last_read":"1522741077.000197","mention_count_display":0,"mention_count":0}
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

let letter = 'a';
let blinkForIms = (instantMessages) => {
  let level = 0;
  letter = '';
  instantMessages.forEach(function (im) {
    // console.log(`im.name: ${im.name}`);
    // console.log(`im: ${JSON.stringify(im, null, 2)}`);
    if (im.has_unreads === true) {
      level = 4;
      console.log("warn: unread IM from " + im.name);
      letter = im.name[0].toLowerCase();
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
        level = Math.max(level, 2);
        console.log("info: unread in " + mpim.name);
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
    //console.log(new Date());

    const response = fetch('https://nrk.slack.com/api/users.counts', {
	    method: 'post', 
	    body: JSON.stringify(body),
	    headers: {
		    'Content-Length': contentLength,
                    'Content-Type': 'application/x-www-form-urlencoded'
	    }
    });
    const body = response.body; 
    let parsedResponse = JSON.parse(body);
      maxLevel = Math.max(maxLevel, blinkForGroups(parsedResponse.groups));
      maxLevel = Math.max(maxLevel, blinkForChannels(parsedResponse.channels));
      maxLevel = Math.max(maxLevel, blinkForIms(parsedResponse.ims));
      maxLevel = Math.max(maxLevel, blinkForMpims(parsedResponse.mpims));


      if (maxLevel === 4) {
        if (letter) {
          samuel.morse(letter);
        } else {
          blink.redWarning();
        }
      } else if (maxLevel === 3) {
        blink.blinkYellow();
      } else if (maxLevel === 2) {
        blink.blinkBlue();
      } else {
        blink.heartBeat();
      }
    }).catch(function (err) {
      // API call failed...
      console.log('caught an exception from requestPromise(slack.users.counts)')
      console.log(err);
    })
  }, updateInterval);
};

console.log('starting slackbeat service, ' + new Date());
loop();
//blink.heartBeat();

