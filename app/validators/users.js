const Joi = require('joi');

module.exports = {
	//注册参数校验
	registerV: Joi.object().keys({
		name: Joi.string().trim().min(1).required(),
		password: Joi.string().trim().min(1).required(),
		email: Joi.string().email().trim().min(1).required(),
	}),
	//登陆参数校验
	loginV: Joi.object().keys({
		name: Joi.string().trim().min(1).required(),
		password: Joi.string().trim().min(1).required()
	}),
};