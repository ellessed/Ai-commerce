const db = require("../config/connection");
const { User, Product, Order } = require("../models");
const userSeeds = require("./userSeeds.json");
const productSeeds = require("./productSeeds.json");

// TODO: add seed for orders
//const orderSeeds = require('./orderSeeds.json');

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    await User.create(userSeeds);

    for (let i = 0; i < productSeeds.length; i++) {
      const { _id } = await Product.create(productSeeds[i]);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("all done!");
  process.exit(0);
});
