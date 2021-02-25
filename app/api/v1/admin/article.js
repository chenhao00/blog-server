const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/article'
});

const { find, create, findById: findBy, update ,delete: del, setCount, hot, recent } = require('../../../controllers/article');

router.get('/', find); //博客列表
router.post('/', create); //新增博客
router.get('/hot', hot); //热门博客
router.get('/recent', recent); //最新博客
router.get('/:id', findBy); //获取某博客
router.patch('/:id', update); //更新某博客
router.delete('/:id', del); //删除博客
router.get('/:id/setCount', setCount); //博客点击量

module.exports = router;