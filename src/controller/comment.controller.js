const commentService = require('../service/comment.service')

class CommentController {
  // 发表评论
  async create (ctx, next) {
    const { momentId, content } = ctx.request.body
    const { id } = ctx.user
    const result = await commentService.create(id, momentId, content)
    ctx.body = result
  }
  // 回复评论
  async reply (ctx, next) {
    const { momentId, content } = ctx.request.body
    const commentId = ctx.params.commentId
    const { id } = ctx.user
    const result = await commentService.reply(id, momentId, content, commentId)
    ctx.body = result
  }

  // 修改评论
  async update (ctx, next) {
    const { commentId } = ctx.params
    const { content } = ctx.request.body
    try {
      const result = await commentService.update(commentId, content)
      ctx.body = result
    } catch (error) {
      console.log(error)
    }
  }

  // 删除评论
  async remove (ctx, next) {
    const { commentId } = ctx.params
    try {
      const result = await commentService.remove(commentId)
      ctx.body = result
    } catch (error) {
      console.log(error)
    }
  }

  // 列表
  async list (ctx, next) {
    const { momentId } = ctx.query
    try {
      const result = await commentService.getCommentsByMomentId(momentId)
      ctx.body = result[0]
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new CommentController()