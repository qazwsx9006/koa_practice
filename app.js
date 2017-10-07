const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');

const app = new Koa();
const router = new Router();



// Router -> /
router.get('/', async(ctx) => {
    // 取的url params
      // let name = ctx.query.name;
      // console.log('name', name);
    //

    // await：由於載入需要時間讀取，因此我們使用 await 等待載入結束。
    // 如果不使用 await，則會發現讀取不到檔案無法顯示畫面。
    await ctx.render('views/index', {
      title: 'MMM'
    })
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

// 以下順序有關聯，順序不同可能造成錯誤
app.use(logger());

app.use(views(__dirname, {
    extension: 'ejs'
}));

app.use(bodyParser());

app.use(router.routes());

app.listen(3001);


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