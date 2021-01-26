//正确返回处理
const SuccessResult = (code, data, msg) => {
	return {
		code: code || 0,
		data: data || null,
		msg: msg || ''
	}
}

module.exports = SuccessResult;