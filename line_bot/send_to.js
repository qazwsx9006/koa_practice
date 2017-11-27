const line = require('@line/bot-sdk');
const config = require('../config/config');
const client = new line.Client(config.Line);

function sendTo(params){
  let msgs = formatMsgs(params.messages)

  client.pushMessage(params.pushId, msgs)
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

module.exports = sendTo;

// $curl test
// curl -v -X POST "domain" -d "validate=123&messages=msg_here!"