const labelService = require('../service/label.service')
const verifyLabelExists = async (ctx, next) => {
  // 1.取出所有要添加的标签
  const { labels } = ctx.request.body
  // 2.判断每一个标签在label中是否存在
  const newLabels = []
  console.log(labels)
  for (let name of labels) {
    const labelResult = await labelService.isLabelExists(name)
    const label = { name }
    console.log(labelResult)
    if (!labelResult) {
      // 没找到，创建标签数据(插入数据库)
      const result = await labelService.create(name)
      label.id = result[0].insertId
      console.log('insertId=>', label)
    } else {
      label.id = labelResult.id
      console.log('label.id=>', label)
    }
    newLabels.push(label)
  }
  console.log(newLabels)
  ctx.labels = newLabels
  await next()
}


module.exports = {
  verifyLabelExists
}
