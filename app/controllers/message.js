const Message = require('../models/message');

class MessageCtl {
  //获取留言板
  async find(ctx) {
    const data = {
      list: await Message.find()
    }
    ctx.body = global.suc(0, data, '获取留言板成功');
  }
  //新增留言
  async create(ctx) {
    const params = ctx.request.body;
    const MessageM = Message(params);
    await MessageM.save();
    ctx.body = global.suc(0, null, '留言板新增成功');
  }
}

module.exports = new MessageCtl();