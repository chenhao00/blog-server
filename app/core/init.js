const Router = require('koa-router');
const requireDirectory = require('require-directory');

class InitManager {
	static initCore(app) {
		InitManager.app = app;
		InitManager.initLoadRouters();
		InitManager.loadConfig();
		InitManager.loadValidate();
		InitManager.loadHttpException();
	}
	//路由自动加载
	static initLoadRouters() {
		const apiDirectory = `${process.cwd()}/app/api`;
		requireDirectory(module, apiDirectory, {
			visit: whenModuleLoad
		});

		function whenModuleLoad(obj) {
			if (obj instanceof Router) {
				InitManager.app.use(obj.routes());
			}
		}
	}

	//设置全局配置参数
	static loadConfig() {
		const configPath = `${process.cwd()}/app/config/config.js`;
		const config = require(configPath);
		global.config = config;
	}

	//设置全局校验参数
	static loadValidate() {
		const joiValidate = require('../middlewares/validate');
		global.joiValite = joiValidate;
	}

	//设置全局错误或成功处理函数
	static loadHttpException() {
		const errors = require('../middlewares/http-exception');
		const success = require('../middlewares/http-success');
		global.errs = errors;
		global.suc = success;
	}
}

module.exports = InitManager;