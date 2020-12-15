const fs = require('fs')

const userService = require('../service/user.service')
const fileService = require('../service/file.service')
const { AVATAR_PATH } = require('../constants/file-path')

class UserController {
  async create (ctx, next) {
    // 获取用户请求的数据
    const user = ctx.request.body
    try {
      // 查询数据
      const result = await userService.create(user)
      // 返回数据
      ctx.body = result
    } catch (error) {
      ctx.body = "数据库错误"
      console.log(error)
    }
  }

  async getAvatarByUserId (ctx, next) {
    const userId = ctx.params.userId
    try {
      const [avatarInfo] = await fileService.getAvatarByUserId(userId)
      console.log(avatarInfo)
      console.log('---------------', avatarInfo[0].filename, `${AVATAR_PATH}/${avatarInfo[0].filename}`)
      // 直接下载
      // ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo[0].filename}`)

      ctx.response.set('content-type', avatarInfo.mimetype)
      ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo[0].filename}`)
    } catch (error) {
      ctx.body = "数据库错误"
      console.log(error)
    }
  }
}

module.exports = new UserController