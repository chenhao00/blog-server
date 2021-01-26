const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const classifySchema = new Schema(
  {
    name: String,
  },
  { versionKey: false }
);

module.exports = model('Classify', classifySchema);