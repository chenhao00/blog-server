//错误返回处理
class HttpException extends Error {
	constructor() {
		super();
		this.code = 500;
		this.msg = '服务器错误';
	}
}

class ParamException extends HttpException {
	constructor(msg) {
		super();
		this.code = 400;
		this.msg = msg || '参数错误';
	}
}

module.exports = {
  HttpException,
  ParamException,
};