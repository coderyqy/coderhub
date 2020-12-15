const connection = require('../app/database')

class FileService {
  // 创建标签
  async createAvatar (filename, mimetype, size, userId) {
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES(?, ?, ?, ?)`
    const result = connection.execute(statement, [filename, mimetype, size, userId])
    return result
  }

  // 获取用户头像信息
  async getAvatarByUserId (userId) {
    const statement = `SELECT * FROM  avatar WHERE user_id = ?`
    const result = connection.execute(statement, [userId])
    return result
  }

  // 保存动态配图
  async createPicture (filename, mimetype, size, userId, momentId) {
    const statement = `INSERT INTO picture (filename, mimetype, size, user_id, moment_id) VALUES(?, ?, ?, ?, ?)`
    const result = connection.execute(statement, [filename, mimetype, size, userId, momentId])
    return result
  }
}
module.exports = new FileService()