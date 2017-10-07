const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');

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


app.use(logger());

app.use(router.routes());

app.listen(3001);