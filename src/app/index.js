const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

// const userRouter = require('../router/user.router')
// const authRouter = require('../router/auth.router')

const useRoutes = require('../router')

const errorHandler = require('./error-handler')

const app = new Koa()

app.use(bodyParser()) // 解析参数
// 1.加载路由的第一种方法
// app.use(userRouter.routes()) // 加载路由
// app.use(userRouter.allowedMethods()) // 请求方法验证

// app.use(authRouter.routes()) // 加载路由
// app.use(authRouter.allowedMethods()) // 请求方法验证

// 2.加载路由的第二种方法
// 专门建一个文件来加载路由
useRoutes(app)

app.on('error', errorHandler)

module.exports = app
