const https = require('https');
const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const json = require('koa-json');
const fs = require('fs');
const static_serve = require('koa-static');

// line bot
const line = require('@line/bot-sdk');
const config = require('./config/config');
const LineAction = require('./line_bot/line-bot');
const sendToMe = require('./line_bot/send_to_me');
const sendTo = require('./line_bot/send_to');
// line bot

const app = new Koa();
const router = new Router();

// Router -> /
router.get('/', async(ctx) => {
  ctx.body = { foo: 'bar' }
});
// Router -> /about
router.get('/about', async(ctx) => {
    ctx.body = 'About Me';
});

// login page (GET)
router.get('/login', async(ctx) => {
    ctx.body = `
    <form method="POST" action="/login">
        <label>UserName</label>
        <input name="usr" /><br/>
        <button type="submit">submit</button>
      </form>
    `;
});
// login page (POST)
router.post('/login', async(ctx) => {
    let usr = ctx.request.body.usr;
    // console.log(ctx.request.header.host)
    // console.log('====')
    // console.log(ctx.request.body)
    // console.log(ctx.request.ip)
    ctx.body = `<p>Welocome,${usr}!</p>`;
});

// middleware for verify request
router.use('/webhook', async(ctx, next) => {
  let res = ctx.request;
  let body = res.body;
  let signature = res.headers['x-line-signature'];

  if(line.validateSignature(JSON.stringify(body), config.Line.channelSecret, signature)){
    ctx.status = 200;
    next();
  }else{
    ctx.body = 'Unauthorized! Channel Serect and Request header aren\'t the same.';
    ctx.status = 401;
  }
});

router.post('/webhook' , async(ctx) => {
  let res = ctx.request;
  let event = res.body.events[0];

  line_action = new LineAction(event);
  result = line_action.eventTypeAction()

  // client.pushMessage(userId, { type: 'text', text: 'hello, world' });
  ctx.body = 'success'
});


// middleware for verify request
router.use('/pushToMe', async(ctx, next) => {
  let res = ctx.request;
  let params = res.body;

  if(params.validate == config.pushMeValidateCode){
    ctx.status = 200;
    next();
  }else{
    ctx.body = 'Unauthorized! Channel Serect and Request header aren\'t the same.';
    ctx.status = 401;
  }
});

router.post('/pushToMe' , async(ctx) => {
  let res = ctx.request;
  let params = res.body;

  sendToMe(params)

  // client.pushMessage(userId, { type: 'text', text: 'hello, world' });
  ctx.body = 'success'
});

// middleware for verify request
router.use('/pushTo', async(ctx, next) => {
  let res = ctx.request;
  let params = res.body;

  if(params.validate == config.pushMeValidateCode && params.pushId){
    ctx.status = 200;
    next();
  }else{
    ctx.body = 'Unauthorized! Channel Serect and Request header aren\'t the same.';
    ctx.status = 401;
  }
});

router.post('/pushTo' , async(ctx) => {
  let res = ctx.request;
  let params = res.body;

  sendTo(params)

  // client.pushMessage(userId, { type: 'text', text: 'hello, world' });
  ctx.body = 'success'
});

// 以下順序有關聯，順序不同可能造成錯誤
app.use(logger());

app.use(json())

app.use(views(__dirname, {
    extension: 'ejs'
}));

app.use(bodyParser());

app.use(static_serve(__dirname + '/public'))

app.use(router.routes());

if(config.DevelopEnv){
  app.listen(3001);
  console.log('start app at port 3001')
}else{
  app.listen(80);

  const options = {
      key: fs.readFileSync(config.SSL.key, 'utf8'),
      cert: fs.readFileSync(config.SSL.cert, 'utf8')
  };
  https.createServer(options, app.callback()).listen(443);
  console.log('start app at port 80 & 443')
}


// koa-routes & koa-view 有順序問題。參考如下
// 由于koa-views中间件结构

// module.exports = viewsMiddleware
// function viewsMiddleware (path, ref) {
//        return function views (ctx, next) {
//          if (ctx.render) return next();
//          ctx.render = function (relPath, locals) {
//           //some code
//          }
//        }
// }
// 先get,post路由处理，然后再处理返回的views函数的话，因为那时还没有添加这个方法
// 所以报出了出现的ctx.render is not function问题。
// koa-routes & koa-view 有順序問提。參考如上

// bodyParser 也需要在 router 之前。 原因應該同上。

