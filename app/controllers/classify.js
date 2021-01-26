const Classify = require('../models/classify');

class ClassifyCtl {
  //获取所有分类
  async find(ctx) {
    const data = {
      list: await Classify.find()
    };
    ctx.body = global.suc(0, data, '获取分类列表成功');
  }
}

module.exports = new ClassifyCtl();