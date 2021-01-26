const Koa = require('koa');
const InitManager = require('./core/init');
const KoaBody = require('koa-body');
const KoaStatic = require('koa-static');
const KoaCors = require('koa2-cors');
const path = require('path');
const mongo = require('./core/db');
const catchError = require('./middlewares/catchError');
const verifyToken = require('./middlewares/verifyToken');
const app = new Koa();

//允许跨域访问
app.use(KoaCors());

//错误处理中间键
app.use(catchError);

//验证token中间键
app.use(verifyToken);

//请求体中间键
app.use(KoaBody({ multipart: true })); //支持文件上传

//静态服务中间件
app.use(KoaStatic(path.join(__dirname, 'public')));

//注册app核心件
InitManager.initCore(app);

//连接数据库
mongo.connect();

app.listen(3001);