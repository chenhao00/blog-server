module.exports = {
	//数据库地址
	database: 'mongodb://127.0.0.1:27017/blog',
	//前端请求域名配置
	configUrl: {
		adminUrl: 'http://halo-chen.top/admin',
		webUrl: 'http://halo-chen.top'
	},
	//token签名
	security: {
		sign: 'halo',
		exp: {
			expiresIn: '7d',
		}
	}
};