const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/classify'
});

const { find, findById: findBy, delete: del } = require('../../../controllers/classify');

router.get('/', find); //分类列表
router.get('/:id', findBy); //分类详情
router.delete('/:id', del); //删除分类

module.exports = router;