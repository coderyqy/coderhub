const fileService = require('../service/file.service')
const userService = require('../service/user.service')
const { AVATAR_PATH } = require('../constants/file-path')
const { APP_HOST, APP_PORT } = require('../app/config')

class FileConterller {
  async saveAvatarInfo (ctx, next) {
    // 1.获取图像相关的信息
    const { filename, mimetype, size } = ctx.req.file
    const { id } = ctx.user
    console.log(filename, mimetype, size, id)
    // 2.把信息保存到数据库
    try {
      // 3保存到avatar表
      await fileService.createAvatar(filename, mimetype, size, id)

      // 4.保存到user表中
      const [avatarInfo] = await fileService.getAvatarByUserId(id)

      const avatarUrl = `${APP_HOST}:${APP_PORT}/user/avatar/${id}`

      await userService.updateAvatarUrlById(avatarUrl, id)
      ctx.body = {
        statusCode: 1110,
        message: "上传头像成功"
      }
    } catch (error) {
      console.log(error)
    }
  }

  async savePictureInfo (ctx, next) {
    // 1.获取图像相关的信息
    const files = ctx.req.files
    const { id } = ctx.user
    const { momentId } = ctx.query
    // 2.把信息保存到数据库
    try {
      for (let item of files) {
        const { filename, mimetype, size } = item
        console.log(filename, mimetype, size, id, momentId)
        await fileService.createPicture(filename, mimetype, size, id, momentId)
        ctx.body = '上传完成'
      }
    } catch (error) {
      ctx.body = '数据库错误'
      console.log(error)
    }
    ctx.body = '上传成功'
  }
}

module.exports = new FileConterller()
