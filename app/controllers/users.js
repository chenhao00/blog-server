class UserCtl {
    //注册接口
    async register(ctx) {
        //
    }
    //登陆接口
    async login(ctx) {
        ctx.body = 'this is 登陆';
    }
}

module.exports = new UserCtl();