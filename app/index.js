const Koa = require('koa');
const InitManager = require('./core/init');
const KoaBody = require('koa-body');
const path = require('path');
const app = new Koa();

//请求体中间键
app.use(KoaBody({
    multipart: true, //支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, 'public/uploads'), //设置文件上传目录
        keepExtensions: true, //保持文件后缀
    },
}));

//注册app核心件
InitManager.initCore(app);

app.listen(3001);