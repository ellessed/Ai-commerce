const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const productSchema = new Schema({
  productName: {
    type: String,
    required: "The Product title is required",
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Product = model("Product", productSchema);

module.exports = Product;
