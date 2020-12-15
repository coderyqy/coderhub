const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, PUBLIC_KEY } = require('../app/config')

class AuthController {
  async login (ctx, next) {
    console.log(ctx.user)
    const { id, name } = ctx.user

    // token => header + payload + 玥
    // 1.非对称加密
    // 把id和name写到token里了，就是payload的里面
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24, // 有效时间(秒)
      algorithm: "RS256" // 加密算法, 默认是HS256
    })

    ctx.body = { id, name, token }
    await next()
  }
}

module.exports = new AuthController
