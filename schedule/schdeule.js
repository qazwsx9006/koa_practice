const PTT_BASE_URL = 'https://www.ptt.cc';
const ptt_download_beauties = require('./beauty');
const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule();
rule.hour = 00;
rule.minute = 30;

const default_url = `${PTT_BASE_URL}/bbs/beauty/index.html`

var j = schedule.scheduleJob(rule, function(){
  console.log(`====> start download ptt beauties at ${new Date()}`);
  ptt_download_beauties(default_url)
});


console.log("start schedule.js")