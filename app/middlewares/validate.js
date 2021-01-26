//参数校验中间键
const Joi = require('joi');

const joiValite = (checkObj, schema) => {
	const { error } = Joi.validate(checkObj, schema, {
		convert: false
	});
	if (error) {
		const {
			details: [
				{
					message
				}
			]
		} = error;
		return `please check your ${message}`;
	}
	return false;
};

module.exports = joiValite;