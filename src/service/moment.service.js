const connection = require('../app/database')

class MomentService {
  // 创建动态
  async create (userId, content) {
    console.log(userId)
    const statement = `INSERT INTO moment (content, user_id) VALUES(?,?)`
    const result = await connection.execute(statement, [content, userId])

    return result
  }

  // 根据用户id获取一条动态
  async getMomentById (id) {
    // const statement = `SELECT * FROM moment WHERE id = ?`
    const statement = `
      SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) user,
        (SELECT IF(COUNT(c.id), JSON_ARRAYAGG(
            JSON_OBJECT(
              'id',c.id, 'content', c.content, 'commentId', c.comment_id,
              'createTime', c.createAt,
              'user',JSON_OBJECT('id',cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url))
          ),NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id 
            WHERE m.id = c.moment_id) comments,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/',picture.filename)) FROM picture WHERE m.id = picture.moment_id) images,
        IF(COUNT(l.id), JSON_ARRAYAGG(
          JSON_OBJECT(
            'id',l.id ,'name',l.name
          )
        ), NULL) labels
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON m.id = ml.moment_id
      LEFT JOIN label l ON ml.label_id = l.id
      WHERE m.id = ?
      GROUP BY m.id
    `
    try {
      const result = await connection.execute(statement, [id])
      return result
    } catch (error) {
      console.log(error)
    }
  }

  // 获取动态列表
  async getMomentList (offset, size) {
    const statement = `
      SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) user,
        (SELECT COUNT(*) FROM comment WHERE comment.moment_id = m.id) commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/',picture.filename)) FROM picture WHERE m.id = picture.moment_id) images
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LIMIT ?, ?;
    `
    const result = await connection.execute(statement, [offset, size])
    return result
  }

  // 更新、修改动态
  async update (content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?`
    const result = await connection.execute(statement, [content, momentId])
    return result
  }

  // 删除动态
  async remove (momentId) {
    const statement = `DELETE FROM moment WHERE id = ?`
    const result = await connection.execute(statement, [momentId])
    return result
  }

  // 为动态添加标签
  async addLabel (momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES(?, ?)`
    try {
      const result = await connection.execute(statement, [momentId, labelId])
      return result
    } catch (error) {
      console.log(error)
    }
  }

  // 查询动态是否已经属于该标签
  async checkLabel (momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`
    const result = await connection.execute(statement, [momentId, labelId])
    console.log('result', result[0])
    return result
  }

  async getFileByFileName (filename) {
    const statement = `SELECT * FROM picture WHERE filename = ?`
    const result = await connection.execute(statement, [filename])
    return result
  }
}

module.exports = new MomentService()