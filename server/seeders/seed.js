const db = require('../config/connection');
const { User, Product, Category, Order } = require('../models');
const userSeeds = require('./userSeeds.json');
const categorySeeds = require('./categorySeeds.json');
const productSeeds = require('./productSeeds.json');

// TODO: add seed for orders
//const orderSeeds = require('./orderSeeds.json');

db.once('open', async () => {
  try {
    await Category.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    await User.create(userSeeds);
    await Category.create(categorySeeds);

    for (let i = 0; i < productSeeds.length; i++) {
      const { _id, category } = await Product.create(productSeeds[i]);
      const user = await Category.findOneAndUpdate(
        { name: category },
        {
          $addToSet: {
            products: _id,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
