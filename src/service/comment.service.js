const connection = require('../app/database')

class CommentService {
  // 发表评论
  async create (user_id, momentId, content) {
    console.log(user_id, momentId, content)
    const statement = `insert into comment (user_id, moment_id, content) values(?, ?, ?)`
    const result = connection.execute(statement, [user_id, momentId, content])
    return result
  }

  // 回复评论
  async reply (user_id, momentId, content, commentId) {
    console.log(user_id, momentId, content)
    const statement = `insert into comment (user_id, moment_id, content, comment_id) values(?, ?, ?, ?)`
    const result = await connection.execute(statement, [user_id, momentId, content, commentId])
    console.log(user_id, momentId, content, commentId)
    return result
  }

  // 修改评论
  async update (commentId, content) {
    const statement = `update comment set content = ? where id = ?`
    const result = await connection.execute(statement, [content, commentId])
    return result
  }

  // 删除评论
  async remove (commentId) {
    const statement = `DELETE FROM comment WHERE id = ?`
    const result = await connection.execute(statement, [commentId])
    return result
  }

  // 获取评论
  async getCommentsByMomentId (momentId) {
    // const statement = `SELECT * FROM comment WHERE moment_id = ?`
    const statement = `
    SELECT c.id, c.content content,c.comment_id commentId, c.createAt createTime ,
      JSON_OBJECT('id', u.id, 'name',u.name) user
    FROM comment c
    LEFT JOIN user u ON u.id = c.user_id
    WHERE moment_id = ? 
    `
    const result = await connection.execute(statement, [momentId])
    return result
  }
}

module.exports = new CommentService()