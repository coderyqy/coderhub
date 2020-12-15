const Router = require('koa-router')
const { create, list } = require('../controller/label.controller')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const labelRouter = new Router({ prefix: '/label' })

labelRouter.post('/', verifyAuth, create)
labelRouter.get('/list', list)

module.exports = labelRouter