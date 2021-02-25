//鉴权中间键
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const Store = require('../core/redis');
const store = new Store();

const verifyToken = async (ctx, next) => {
	//判断不需要token的接口
	if (ctx.request.header.origin === global.config.configUrl.webUrl) {
		await next();
		return;
	}
	const url = ctx.url.split('?')[0];
	if (url.indexOf('register') > -1 || url.indexOf('login') > -1 || url.indexOf('upload') > -1) {
		await next();
		return;
	}
	const token = ctx.request.header.token;
	//先判断请求头里有没token
	if (!token) {
		ctx.body = global.suc(-1, null, 'token无效'); 
		return;
	}
	//判断token是否失效
	const payload = jwt.verify(token, global.config.security.sign, (err, decoded) => {
		if (err) {
			switch (err.name) {
				case 'JsonWebTokenError': 
					ctx.body = global.suc(-1, null, 'token无效');
					break;
				case 'TokenExpiredError':
					ctx.body = global.suc(-1, null, 'token已过期');	
					break;
			}
			return false;
		} else {
			return decoded;
		}
	});
	if (!payload) {
		return;
	}
	//再判断数据库里是否有这个用户
	const existUser = await User.findOne({ _id: payload.userId });
	if (!existUser) {
		ctx.body = global.suc(-1, null, 'token无效');
		return;
	}
	//再判断redis是否有数据
	const origin = await store.get(payload.userId);
	if (origin === null || origin.token !== token) {
		ctx.body = global.suc(-1, null, 'token无效');
		return;
	}
	await next();
};

module.exports = verifyToken;