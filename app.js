const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();


// Router -> /
router.get('/', async(ctx) => {
    // 取的url params
      let name = ctx.query.name;
      console.log('name', name);
    //
    ctx.body = `Hello! ${name}`;
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

app.use(logger());

app.use(bodyParser());

app.use(router.routes());

app.listen(3001);