const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const categorySchema = new Schema({
  name: {
    type: String,
    required: 'The Category name is required',
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  }
});

const Category = model('Category', categorySchema);

module.exports = Category;
