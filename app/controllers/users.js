const User = require('../models/users');
const { registerV, loginV } = require('../validators/users');
const jwt = require('jsonwebtoken');
const crypt = require('../utils/crypt');
const Store = require('../core/redis');
const store = new Store();

class UserCtl {
	//注册接口
	async register(ctx) {
		const params = ctx.request.body;
		//参数校验
		const validateRes = global.joiValite(params, registerV);
		if (validateRes) {
			throw new global.errs.ParamException(validateRes);
		}
		//判断是否已经注册过
		const { name } = params;
		const repeatUser = await User.findOne({ name });
		if (repeatUser) {
			ctx.body = global.suc(1, null, '该用户已存在');
			return;
		}
		const UserM = User(params);
		//密码加密
		UserM.password = crypt.encrypt(UserM.password);
		await UserM.save();
		ctx.body = global.suc(0, null, '注册成功');
	}

	//登陆接口
	async login(ctx) {
		const params = ctx.request.body;
		//参数校验
		const validateRes = global.joiValite(params, loginV);
		if (validateRes) {
			throw new global.errs.ParamException(validateRes);
		}
		//判断用户名是否存在
		const { name }  = params;
		const repeatUser = await User.findOne({name});
		if (!repeatUser) {
			ctx.body = global.suc(1, null, '该用户不存在');
			return;
		}
		//判断密码是否正确
		const checkPw = crypt.decrypt(params.password, repeatUser.password);
		if (!checkPw) {
			ctx.body = global.suc(1, null, '密码不正确');
			return;
		}
		//生成token的数据
		const payload = {
			userId: repeatUser._id,
			name: params.name
		};
		//获取签名
		const token = jwt.sign(payload, global.config.security.sign, global.config.security.exp);
		//存到redis
	 	await store.set(payload.userId, { token, time: Date.parse(new Date()) / 1000, name: params.name });
		const loginMsg = {
			token,
			userId: repeatUser._id,
			name: params.name
		};
		ctx.body = global.suc(0, loginMsg, '登陆成功');
	}

	//登出接口
	async quit(ctx) {
		const token = ctx.request.header.token;
		const payload = jwt.verify(token, global.config.security.sign);
		await store.destory(payload.userId);
		ctx.body = global.suc(0, null, '登出成功');
	}
}

module.exports = new UserCtl();