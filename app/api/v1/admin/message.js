const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/message'
});

const { find, create, delete: del, findById: findBy, replay } = require('../../../controllers/message');

router.get('/', find); //留言板列表
router.post('/', create); //新增留言
router.get('/:id', findBy); //获取留言
router.post('/:id', replay); //回复留言
router.delete('/:id', del); //删除留言

module.exports = router;