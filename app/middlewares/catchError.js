//全局异常捕获
const { HttpException } = require('./http-exception');

const catchError = async (ctx, next) => {
	try {
		await next();
	} catch (error) {
		console.log(error);
		const isHttpException = error instanceof HttpException;
		ctx.body = {
			timestamp: Date.now(),
			status: isHttpException ? error.code : 500,
			msg: isHttpException ? error.msg : '未知错误',
			request: `${ctx.method} ${ctx.path}`,
		};
		ctx.status = isHttpException ? error.code : 500;
	}
};

module.exports = catchError;