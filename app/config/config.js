module.exports = {
	//数据库地址
	database: 'mongodb://localhost/blog',
	//前端请求域名配置
	configUrl: {
		adminUrl: 'http://localhost:8082',
		webUrl: 'http://localhost:8088'
	},
	//token签名
	security: {
		sign: 'halo',
		exp: {
			expiresIn: '7d',
		}
	}
};