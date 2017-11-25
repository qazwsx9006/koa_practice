const line = require('@line/bot-sdk');
const config = require('../config/config');
const client = new line.Client(config.Line);

function sendToMe(params){
  let msgs = formatMsgs(params.messages)

  client.pushMessage(config.MeId, msgs)
    .then(() => {
      console.log('push to me!!')
    })
    .catch((err) => {
      console.log('push to me raise err', err)
      // error handling
    });
}

function formatMsgs(message){
  return message.split(',,').map((msg) => { return {type: 'text', text: msg} })
}

module.exports = sendToMe;

// $curl test
// curl -v -X POST "domain" -d "validate=123&messages=msg_here!"