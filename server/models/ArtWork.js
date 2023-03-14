const { Schema } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const artSchema = new Schema({
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
});

module.exports = artSchema;
