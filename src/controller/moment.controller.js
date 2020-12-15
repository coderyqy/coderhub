const fs = require('fs')
const momentService = require('../service/moment.service')
const { PICTURE_PATH } = require('../constants/file-path')

class MomentController {
  // 创建评论
  async create (ctx, next) {
    const userId = ctx.user.id
    const content = ctx.request.body.content
    const result = await momentService.create(userId, content)
    ctx.body = result
  }

  // 获取一条动态
  async detail (ctx, next) {
    // 获取参数
    const momentId = ctx.params.momentId
    // 根据id去查数据库
    const result = await momentService.getMomentById(momentId)
    ctx.body = result[0]
  }

  // 获取多条动态
  async list (ctx, next) {
    const { offset, size } = ctx.query
    console.log(offset, size)
    try {
      const result = await momentService.getMomentList(offset, size)
      ctx.body = result[0]
    } catch (error) {
      ctx.body = '数据库错误'
      console.log(error)
    }
  }

  // 修改动态
  async update (ctx, next) {
    const momentId = ctx.params.momentId
    const content = ctx.request.body.content

    const result = await momentService.update(content, momentId)
    ctx.body = result[0]
  }

  // 删除动态
  async remove (ctx, next) {
    const momentId = ctx.params.momentId
    const result = await momentService.remove(momentId)
    ctx.body = result
  }

  // 为动态添加标签
  async addLabel (ctx, next) {
    const { momentId } = ctx.params
    const labels = ctx.labels
    console.log("addLabel", labels)
    for (let item of labels) {
      const result = await momentService.checkLabel(momentId, item.id)
      if (result[0] == '') {
        await momentService.addLabel(momentId, item.id)
      }
    }
    ctx.body = "为动态添加标签成功"
  }

  // 获取动态配图的信息
  async getFileByFileName (ctx, next) {
    const { filename } = ctx.params
    console.log(filename)
    try {
      const [pictureInfo] = await momentService.getFileByFileName(filename)
      console.log(pictureInfo[0])
      console.log(pictureInfo.mimetype, pictureInfo[0].filename)
      ctx.response.set('content-type', pictureInfo.mimetype)
      ctx.body = fs.createReadStream(`${PICTURE_PATH}/${pictureInfo[0].filename}`)
    } catch (error) {
      console.log(error)
      ctx.body = '数据库错误'
    }
  }
}

module.exports = new MomentController()
