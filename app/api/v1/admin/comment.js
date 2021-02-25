const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/comment'
});

const { find, create, findById: findBy, replay, delete: del } = require('../../../controllers/comment');

router.get('/', find); //评论列表
router.post('/', create); //添加评论
router.get('/:id', findBy); //查看某评论
router.post('/:id', replay); //回复评论
router.delete('/:id', del); //删除评论

module.exports = router;