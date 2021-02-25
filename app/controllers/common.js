//公共接口
const path = require('path');
const fs = require('fs');
const getUploadDir = require('../utils/getUploadDir');

class commonCtl {
	async upload(ctx) {
		const file = ctx.request.files.file;
		//上传文件大小限制
		if (file.size > 2 * 1024 * 1024) {
			ctx.body = global.suc(1, null, '最大文件大小限制为2M');
			return;
		}
		//修改文件名称
		const date = new Date();
		const newFileName = Date.parse(date) / 1000 + '.' + file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
		//创建可读流
		const reader = fs.createReadStream(file.path);
		const fileDir = path.join(__dirname, `../public/uploads/${getUploadDir()}`);
		if (!fs.existsSync(fileDir)) {
			fs.mkdirSync(fileDir);
		}
		const filePath = `${fileDir}/${newFileName}`;
		//创建可写流
		const upStream = fs.createWriteStream(filePath);
		//可读流通过管道写入可写流
		reader.pipe(upStream);
		const urlMsg = {
			filename: newFileName,
			url: 'http://' + ctx.headers.host + `/uploads/${getUploadDir()}/` + newFileName,
		};
		ctx.body = global.suc(0, urlMsg, '上传图片成功');
	}
}

module.exports = new commonCtl();