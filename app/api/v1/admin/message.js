const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/message'
});

const { find, create } = require('../../../controllers/message');

router.get('/', find); //留言板列表
router.post('/', create); //新增留言

module.exports = router;