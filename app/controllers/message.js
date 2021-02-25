const Message = require('../models/message');

class MessageCtl {
  //获取留言板
  async find(ctx) {
    const { pageSize = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(pageSize * 1, 1);
		//查询列表
		let list = await Message
			.find()
			.limit(perPage)
			.skip(page * perPage);
		//总记录数
		const total = await Message
			.find()
			.countDocuments();
		//总页数
		const totalPages = parseInt((total + Number(pageSize) - 1) / Number(pageSize));
		const data = {
			list,
			page: Number(ctx.query.page),
			total,
			totalPages,
		}
		ctx.body = global.suc(0, data, '获取留言板成功');
  }
  //新增留言
  async create(ctx) {
		const params = ctx.request.body;
		params.createTime = Date.parse(new Date()) / 1000;
    await new Message(params).save();
    ctx.body = global.suc(0, null, '留言板新增成功');
  }
  //获取留言
  async findById(ctx) {
		const data = await Message.findById(ctx.params.id);
		ctx.body = global.suc(0, data, '获取留言成功');
  }
  //回复某留言
	async replay(ctx) {
		const params = ctx.request.body;
		params.replayTime = params.replay ? Date.parse(new Date()) / 1000 : null;
    const data = await Message.findByIdAndUpdate(ctx.params.id, params, { new: true });
		ctx.body = global.suc(0, data, '回复留言成功');
	}
  //删除留言
	async delete(ctx) {
		await Message.findByIdAndRemove(ctx.params.id);
		ctx.body = global.suc(0, null, '删除成功');
	}
}

module.exports = new MessageCtl();