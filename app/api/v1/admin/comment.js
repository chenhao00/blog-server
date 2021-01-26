const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/comment'
});

const { find } = require('../../../controllers/comment');

router.get('/', find); //评论列表

module.exports = router;