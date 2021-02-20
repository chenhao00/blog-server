const Article = require('../models/article');
const Classify = require('../models/classify');
const Comment = require('../models/comment');
const { addArticleV } = require('../validators/article');
const Store = require('../core/redis');
const store = new Store('HotList');

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
			.sort({createTime: -1})
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
			let data = JSON.parse(JSON.stringify(item));
			const scanNumList = await store.get('');
			if (scanNumList && scanNumList.length > 0) {
				scanNumList.map(item1 => {
					if (item.id === item1.id) {
						data.scan = item1.num;
					}
				});
			}
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
		if (!params.classifyId) {
			params.classifyId = await combineClassify(params);
		}
		//设置创建时间和更新时间
		params.createTime = Date.parse(new Date()) / 1000
		params.updateTime = Date.parse(new Date()) / 1000;
		await new Article(params).save(async function(err, doc) {
			//把文章添加到新的分类
			await Classify.updateOne({ _id: doc.classifyId }, { $addToSet: { articles: doc._id } });
		});
		ctx.body = global.suc(0, null, '博客新增成功');
	}
	//查看某博客
	async findById(ctx) {
		let data = await Article.findById(ctx.params.id).lean(true);
		//把评论加到文章详情里
		const com = await Comment.find({ articleId: ctx.params.id });
		data.comment = com;
		ctx.body = global.suc(0, data, '获取博客成功');
	}
	//更新某博客
	async update(ctx) {
		const params = ctx.request.body;
		validate(params);
		if (!params.classifyId) {
			params.classifyId = await combineClassify(params);
		}
		//把文章添加到新的分类并删除原来的分类
		const curArticle = await Article.findById(ctx.params.id);
		if (params.classifyId !== curArticle.classifyId) {
			await Classify.updateOne({ _id: curArticle.classifyId }, { $pull: { articles: curArticle._id } });
			await Classify.updateOne({ _id: params.classifyId }, { $addToSet: { articles: curArticle._id } });
		}
		//修改时更新时间
		params.updateTime = Date.parse(new Date()) / 1000;
		const data = await Article.findByIdAndUpdate(ctx.params.id, params);
		ctx.body = global.suc(0, data, '更新博客成功');
	}
	//删除博客
	async delete(ctx) {
		await Article.findByIdAndRemove(ctx.params.id);
		ctx.body = global.suc(0, null, '删除成功');
		//删除文章的评论内容
		await Comment.deleteMany({ articleId: ctx.params.id });
		//删除文章的所属分类
		await Classify.updateOne({ articles: ctx.params.id }, { $pull: { articles: ctx.params.id } });
		//删除redis中存的数据
		let list = await store.get('');
		list = list.filter(item => item.id !== ctx.params.id);
		await store.set('', list);
	}
	//统计博客点击量
	async setCount(ctx) {
		let list = await store.get('') || [];
		let num = 0;
		const result = list.some(item => {
			if (item.id === ctx.params.id) {
				return true;
			}
		});
		if (result) {
			list = list.map(item => {
				if (item.id === ctx.params.id) {
					item.num = item.num += 1;
				}
				return item;
			});
		} else {
			const data = await Article.findById(ctx.params.id);
			const title = data.title;
			list.push({
				id: ctx.params.id,
				num: num += 1,
				title: title
			});
		}
		await store.set('', list.sort(sortHot('num')));
		ctx.body = '';
	}
	//热门博客排行
	async hot(ctx) {
		const list = await store.get('') || [];
		ctx.body = global.suc(0, list.slice(0, 10), '获取博客排行成功');
	}
	//最新博客排行
	async recent(ctx) {
		const list = await Article.find({})
			.sort({createTime: -1})
			.limit(10);
		ctx.body = global.suc(0, list, '获取最新博客成功');
	}
}

//校验参数
function validate(params) {
	const validateRes = global.joiValite(params, addArticleV);
	if (validateRes) {
		throw new global.errs.ParamException(validateRes);
	}
}

//redis里文章排序
function sortHot(attr) {
	return function(a, b) {
		return b[attr] - a[attr];
	}
}

//设置新分类的id
function combineClassify(params) {
	return new Promise(async (resolve, reject) => {
		await Classify({ name: params.classifyName }).save();
		const classify = await Classify.findOne({ name: params.classifyName });
		resolve(classify._id);
	});
}

module.exports = new ArticleCtl();