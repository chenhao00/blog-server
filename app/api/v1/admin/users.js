const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/users'
});
const { register, login, quit } = require('../../../controllers/users');

router.post('/register', register); //注册接口
router.post('/login', login); //登陆接口
router.get('/quit', quit); //登出接口

module.exports = router;