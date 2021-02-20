const mongoose = require('mongoose');
const { schema } = require('./article');
const { Schema, model } = mongoose;

const classifySchema = new Schema(
  {
    name: String,
    articles: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
      select: false
    }
  },
  { versionKey: false }
);

module.exports = model('Classify', classifySchema);