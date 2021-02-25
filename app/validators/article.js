const Joi = require('joi');

module.exports = {
  //新增博客参数校验
  addArticleV: Joi.object().keys({
    title: Joi.string().trim().min(1).required(),
    contents: Joi.string().trim().min(1).required(),
    mode: Joi.number().required(),
    articleTags: Joi.array(),
    way: Joi.number().required(),
    classifyName: Joi.string().required(),
    classifyId: Joi.string().allow('')
  })
};