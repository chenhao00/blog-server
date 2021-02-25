const mongoose = require('mongoose');
const moment = require('moment');
const { Schema, model } = mongoose;

const userSchema = new Schema(
	{
		name: String,
		password: String,
		email: String,
		createTime: {
			type: String,
			default: () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
		}
	},
	{ versionKey: false }
);

module.exports = model('User', userSchema);