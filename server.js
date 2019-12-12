const Koa = require('koa');

const next = require('next');
//判断环境为开发环境
const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const Router = require('koa-router');
const handle = app.getRequestHandler();

const RedisSessionStore = require('./server/redis-store');
const session = require('koa-session');
const RedisClient = require('ioredis');
/**
 * 将next当成node服务的中间件来启动一个server
 */
const redis = new RedisClient(); //redis
app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    server.keys = ['jett-dev-github-app-session-keys'];

    const SESSION_CONFIG = {
        key:'x-web',
        maxAge:3600*1000, //过期时间
        store:new RedisSessionStore(redis)
    };
    server.use(session(SESSION_CONFIG,server));

    server.use(router.routes());
    //测试接口
    //设置用户信息
    router.get('/api/set-user',async ctx => {
        ctx.session.userInfo = {'name':'pjt',age:18};
    })

    router.get('/api/del-user',async ctx => {
        ctx.session = null;
    })

    router.get('/api/user',async (ctx,next) => {
        const authorToken = ctx.cookies.get('x-web');
        if (!authorToken) {
            ctx.status = 401
            ctx.body = 'Need Login'
        } else {
            ctx.body = authorToken
            ctx.set('Content-Type', 'application/json')
        }
    })

    server.use(async (ctx,next) => {
        //讲session里用户信息存放在req的session里面
        ctx.req.session = ctx.session;
        await handle(ctx.req,ctx.res);
        ctx.respond = false;
    });

    server.listen(3333,() => {
        console.log("server start at port 3333");
    })
});
