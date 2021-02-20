const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    name: String,
    content: String,
    articleId: String,
    replay: String,
    commentArticle: { type: Schema.Types.ObjectId, ref: 'Article', select: false },
    createTime: Number,
    replayTime: Number
  },
  { versionKey: false }
);

module.exports = model('Comment', commentSchema);