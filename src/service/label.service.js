const connection = require('../app/database')

class LabelService {
  // 创建标签
  async create (name) {
    console.log("创建tags")
    const statement = `INSERT INTO label (name) VALUES(?)`
    const result = connection.execute(statement, [name])
    return result
  }

  // 判断标签是否存在
  async isLabelExists (name) {
    const statement = `SELECT * FROM label WHERE name = ?;`
    try {
      const [result] = await connection.execute(statement, [name])
      return result[0]
    } catch (error) {
      console.log(error)
      ctx.body = `数据库错误 => isLabelExists()`
    }
  }

  // 获取标签列表
  async getLables (offset, limit) {
    // offset是指从哪个开始，limit是指需要查几个数据
    console.log('getLables')
    const statement = `SELECT * FROM label Limit ?, ?`
    const result = await connection.execute(statement, [offset, limit])
    return result
  }
}

module.exports = new LabelService()