const Koa = require('koa');
const logger = require('koa-logger');

const app = new Koa();

// app.use(async(ctx,next) => {
//   const start = Date.now();
//   await next();
//   const ms = Date.now() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms} ms`)
// });
app.use(logger());

app.use(async function(ctx) {
    ctx.body = 'Hello Koa2';
});


app.listen(3001);