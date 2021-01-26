const Article = require('../models/article');
const Classify = require('../models/classify');
const { addArticleV } = require('../validators/article');
const Store = require('../core/redis');
const store = new Store('Count-');

class ArticleCtl {
	//获取博客列表
	async find(ctx) {
		const { pageSize = 10 } = ctx.query;
		const page = Math.max(ctx.query.page * 1, 1) - 1;
		const perPage = Math.max(pageSize * 1, 1);
		const q = {};
		if (ctx.query.title) {
			q.title = new RegExp(ctx.query.title);
		}
		if (ctx.query.classifyName && ctx.query.classifyName !== '0') {
			q.classifyName = new RegExp(ctx.query.classifyName);
		}
		if (ctx.query.mode && ctx.query.mode !== '0') {
			q.mode = ctx.query.mode;
		}
		//查询列表
		let list = await Article
			.find(q)
			.limit(perPage)
			.skip(page * perPage);
		//总记录数
		const total = await Article
			.find(q)
			.countDocuments();
		//总页数
		const totalPages = parseInt((total + Number(pageSize) - 1) / Number(pageSize));
		//把点击量加到数据中去
		list = await Promise.all(list.map(async (item) => {
			const data = JSON.parse(JSON.stringify(item));
			const scanNum = await store.get(item.id);
			data.scan = scanNum;
			return data;
		}));
		const data = {
			list,
			page: Number(ctx.query.page),
			total,
			totalPages,
		}
		ctx.body = global.suc(0, data, '获取博客列表成功');
	}
	//新增博客
	async create(ctx) {
		const params = ctx.request.body;
		validate(params);
		//await combineClassify(params);
		const ArticleM = Article(params);
		await ArticleM.save();
		ctx.body = global.suc(0, null, '博客新增成功');
	}
	//查看某博客
	async findById(ctx) {
		const data = await Article.findById(ctx.params.id);
		data.scanCount += 1;
		const ArticleM = Article(data);
		await ArticleM.save();
		ctx.body = global.suc(0, data, '获取博客成功');
	}
	//更新某博客
	async update(ctx) {
		const params = ctx.request.body;
		validate(params);
		//await combineClassify(params);
		const data = await Article.findByIdAndUpdate(ctx.params.id, params);
		ctx.body = global.suc(0, data, '更新博客成功');
	}
	//删除博客
	async delete(ctx) {
		await Article.findByIdAndRemove(ctx.params.id);
		ctx.body = global.suc(0, null, '删除成功');
	}
	//统计博客点击量
	async setCount(ctx) {
		let num = await store.get(ctx.params.id) || 0;
		num += 1;
		await store.set(ctx.params.id, num);
		ctx.body = '';
	}
}

//校验参数
function validate(params) {
	const validateRes = global.joiValite(params, addArticleV);
	if (validateRes) {
		throw new global.errs.ParamException(validateRes);
	}
}

//合并分类
// function combineClassify(params) {
// 	return new Promise((resolve, reject) => {
// 		if (params.classify.length > 0) {
// 			const arr = params.classify;
// 			Classify.find({}, (err, doc) => {
// 				if (err) {
// 					reject();
// 					return;
// 				}
// 				const nameArr = doc && doc.map(item => item.name);
// 				arr.map(item => {
// 					if (doc && doc.length > 0 && nameArr.indexOf(item) > -1) {
// 						resolve();
// 						return;
// 					}
// 					const ClassifyM = Classify({ name: item });
// 					ClassifyM.save();
// 					resolve();
// 				});
// 			});
// 		}
// 	});
// }

module.exports = new ArticleCtl();