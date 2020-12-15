const jwt = require('jsonwebtoken')

const errorType = require('../constants/error-type')
const userService = require('../service/user.service')
const authService = require('../service/auth.service')
const md5password = require('../utils/password-handle')
const config = require('../app/config')

const verifyLogin = async (ctx, next) => {
  // 1.用户名或者密码是否存在
  const { name, password } = ctx.request.body
  if (!name || !password || name === '' || password === '') {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 2.判断用户是否存在
  const result = await userService.getUserByName(name)
  const user = result[0]
  if (!user.length) {
    const error = new Error(errorType.USER_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 3.有这个人就对比密码是否正确
  const reqPassword = md5password(password)
  if (reqPassword != user[0].password) {
    const error = new Error(errorType.USER_INFO_ERROR)
    return ctx.app.emit('error', error, ctx)
  }
  ctx.user = user[0]
  await next()
}

// 验证token
const verifyAuth = async (ctx, next) => {
  // 1.在请求头中获取token
  const authorization = ctx.headers.authorization
  if (!authorization) { // 没有token
    const error = new Error(errorType.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.replace('Bearer ', '')
  // 2.用公钥进行解密
  try {
    const result = jwt.verify(token, config.PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result
  } catch (err) {
    const error = new Error(errorType.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }

  await next()
}

const verifyPermission = async (ctx, next) => {
  console.log("验证权限")
  // 1.获取参数 
  const [resourceKey] = Object.keys(ctx.params)
  const { id } = ctx.user
  const tableName = resourceKey.replace('Id', '')
  const resourceId = ctx.params[resourceKey]
  // 查询是否具备权限
  const isPermission = await authService.checkResource(tableName, resourceId, id)
  if (!isPermission) {
    const error = new Error(errorType.UNPERMISSION)
    return ctx.app.emit('error', error, ctx)
  }
  await next()
}

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}