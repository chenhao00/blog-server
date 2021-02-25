const Classify = require('../models/classify');

class ClassifyCtl {
  //获取所有分类
  async find(ctx) {
    const data = {
      list: await Classify.find().populate('articles')
    };
    ctx.body = global.suc(0, data, '获取分类列表成功');
  }
  //查看某个分类
  async findById(ctx) {
    const data = await Classify.findById(ctx.params.id).populate('articles');
		ctx.body = global.suc(0, data, '获取分类成功');
  }
  //删除分类
	async delete(ctx) {
		await Classify.findByIdAndRemove(ctx.params.id);
		ctx.body = global.suc(0, null, '删除成功');
	}
}

module.exports = new ClassifyCtl();