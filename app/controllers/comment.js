const Comment = require('../models/comment');
const Article = require('../models/article');

class CommentCtl {
  async find(ctx) {
		const { pageSize = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(pageSize * 1, 1);
		//查询列表
		const list = await Comment
			.find()
			.limit(perPage)
      .skip(page * perPage)
      .populate('commentArticle');
		//总记录数
		const total = await Comment
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
		ctx.body = global.suc(0, data, '获取评论列表成功');
	}
  //新增评论
  async create(ctx) {
    const params = {
      ...ctx.request.body,
			commentArticle: ctx.request.body.articleId,
			createTime: Date.parse(new Date()) / 1000
    };
    await new Comment(params).save();
    ctx.body = global.suc(0, null, '评论新增成功');
  }
  //查看评论
	async findById(ctx) {
		const data = await Comment.findById(ctx.params.id).populate('commentArticle');;
		ctx.body = global.suc(0, data, '获取博客成功');
  }
  //回复某评论
	async replay(ctx) {
		const params = ctx.request.body;
		params.replayTime = params.replay ? Date.parse(new Date()) / 1000 : null;
    const data = await Comment.findByIdAndUpdate(ctx.params.id, params, { new: true });
		ctx.body = global.suc(0, data, '回复留言成功');
	}
  //删除评论
	async delete(ctx) {
		await Comment.findByIdAndRemove(ctx.params.id);
		ctx.body = global.suc(0, null, '删除成功');
	}
}

module.exports = new CommentCtl();
