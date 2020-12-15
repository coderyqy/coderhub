const Router = require('koa-router')
const momentRouter = new Router({ prefix: "/moment" })

const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { create, detail, list, update, remove, addLabel, getFileByFileName } = require('../controller/moment.controller')
const { verifyLabelExists } = require('../middleware/label.middleware')


momentRouter.post('/', verifyAuth, create)
momentRouter.get('/list', list)
momentRouter.get('/:momentId', detail)

momentRouter.patch('/update/:momentId', verifyAuth, verifyPermission, update)
momentRouter.delete('/delete/:momentId', verifyAuth, verifyPermission, remove)
// 为动态添加标签
momentRouter.post('/label/:momentId', verifyAuth, verifyPermission, verifyLabelExists, addLabel)
// 动态配图的服务
momentRouter.get('/images/:filename', getFileByFileName)

module.exports = momentRouter