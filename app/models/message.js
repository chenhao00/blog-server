const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const moment = require('moment');

const messageSchema = new Schema(
  {
    name: String,
    content: String,
    createTime: {
      type: String,
      default: () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  { versionKey: false }
);

module.exports = model('Message', messageSchema);