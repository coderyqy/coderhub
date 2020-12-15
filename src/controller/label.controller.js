const labelService = require('../service/label.service')
class LabelController {
  // 创建标签
  async create (ctx, next) {
    const { name } = ctx.request.body
    try {
      const result = await labelService.create(name)
      ctx.body = result
    } catch (error) {
      console.log(error)
      ctx.body = "数据库错误"
    }
  }

  // 列表
  async list (ctx, next) {
    console.log('limit, offest', ctx.query)
    const { limit, offset } = ctx.query
    console.log(limit, offset)
    try {
      const result = await labelService.getLables(offset, limit)
      ctx.body = result[0]
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new LabelController()