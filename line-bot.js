const line = require('@line/bot-sdk');
const config = require('./config');

const lineConfig = config.Line;


new line.Client(lineConfig);
a = line.middleware(lineConfig);

console.log( lineConfig);