const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    name: String,
    content: String,
    replay: String,
    createTime: Number,
    replayTime: Number
  },
  { versionKey: false }
);

module.exports = model('Message', messageSchema);