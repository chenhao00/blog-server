const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/classify'
});

const { find } = require('../../../controllers/classify');

router.get('/', find); //分类列表

module.exports = router;