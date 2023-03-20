const { Schema, model } = require("mongoose");

const favouriteSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  isFavourite: {
    type: Boolean,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Favourite = model("Favourite", favouriteSchema);

module.exports = Favourite;
