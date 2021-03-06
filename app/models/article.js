const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    title: String,
    contents: String,
    mode: Number,
    articleTags: Array,
    way: Number,
    classifyId: String, //分类id
    classifyName: String, //分类名称
    scanCount: Number, //浏览量
    createTime: Number,
    updateTime: Number
  }, { versionKey: false }
);

module.exports = model('Article', articleSchema);