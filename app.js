const Koa = require('koa');

const app = new Koa();

app.use(async function(ctx) {
    ctx.body = 'Hello Koa2';
});

app.listen(3001);