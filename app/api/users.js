const Router = require('koa-router');
const router = new Router({
    prefix: '/api/users'
});
const { register, login } = require('../controllers/users');

router.post('/register', register); //注册接口
router.post('/login', login); //登陆接口

module.exports = router;