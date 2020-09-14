const Router = require('koa-router');
const requireDirectory = require('require-directory');

class InitManager {
    static initCore(app) {
        InitManager.app = app;
        InitManager.initLoadRouters();
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
}

module.exports = InitManager;