const connection = require('../app/database')

class UserService {
  async create (user) {
    // 将用户数据保存到数据库中
    const { name, password } = user
    const statement = `INSERT INTO user (name, password) VALUES (?,?);`
    const result = await connection.execute(statement, [name, password])

    return result
  }

  async getUserByName (name) {
    // 根据 用户名 查询数据库
    const statement = `SELECT * FROM user WHERE name = ?;`
    const result = await connection.execute(statement, [name])
    return result
  }

  async updateAvatarUrlById (avatarUrl, userId) {
    const statement = `UPDATE user SET avatar_url = ? WHERE id = ?`
    const result = await connection.execute(statement, [avatarUrl, userId])
    return result
  }
}

module.exports = new UserService()