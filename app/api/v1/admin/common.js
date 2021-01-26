const Router = require('koa-router');
const router = new Router({
  prefix: '/api/v1/admin/common'
});
const { upload } = require('../../../controllers/common');

router.post('/upload', upload); //上传图片接口

module.exports = router;