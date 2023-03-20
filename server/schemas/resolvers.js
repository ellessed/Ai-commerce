require("dotenv").config();
const { AuthenticationError } = require("apollo-server-express");
const { User, Product, Order, Favourite } = require("../models");
const { signToken } = require("../utils/auth");

const stripe = require("stripe")(process.env.PRIVATE_API_KEY);

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .populate("recentArt")
        .populate("favourites");
    },
    products: async () => {
      return Product.find();
    },
    product: async (parent, { productId }) => {
      return Product.findOne({ _id: productId });
    },
    orders: async () => {
      return Order.find();
    },
    order: async (parent, { orderId }) => {
      return Order.findOne({ _id: orderId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id)
          .populate({
            path: "orders",
            populate: {
              path: "products.productId",
              model: "Product",
            },
          })
          .populate({
            path: "recentArt",
            model: "Product",
          })
          .populate({
            path: "favourites",
            populate: {
              path: "productId",
              model: "Product",
            },
          });
        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    recentArt: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("recentArt");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    getFavourites: async (parent, { productName }, context) => {
      //if the user logged in
      if (context.user) {
        try {
          //find a product by the product name
          const product = await Product.findOne({ productName: productName });
          console.log(product);
          //find a favourite by the product _id
          const favourite = await Favourite.findOne({ productId: product._id });
          //if no faourite is found in the database return false
          if (!favourite) {
            return false;
          }
          //find a user that has the favourite _id and the logged in user._id
          const user = await User.findOne({
            favourites: favourite._id,
            userId: context.user._id,
          });
          //if a user is found
          if (user) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    newOrder: async (
      parent,
      { customerName, customerAddress, items, total },
      context
    ) => {
      if (context.user) {
        const order = await Order.create({
          customerName,
          customerAddress,
          items,
          total,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { orders: order._id } }
        );

        return thought;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    checkout: async (parent, { amount }) => {
      // Other payment checks and vaalidations

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "gbp",
        });
        return {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
        };
      } catch (error) {
        console.log(error);
        throw new AuthenticationError("Payment Failed!");
      }
    },
    addRecentArt: async (parent, { productName, imageUrl, price }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to perform this action"
        );
      }

      let productFound = await Product.findOne({ productName: productName });
      if (productFound) {
        const productUpdate = await Product.findOneAndUpdate(
          { productName: productName },
          { imageUrl: imageUrl, price: price },
          { new: true }
        );
        return productUpdate;
      }

      const product = await Product.create({
        productName,
        imageUrl,
        price,
      });

      try {
        // Find the user by ID and update their recentArt array
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { recentArt: product._id } },
          { new: true }
        ).populate("recentArt.product");

        return product;
      } catch (err) {
        console.error(err);
        throw new Error("Something went wrong");
      }
    },
    addProduct: async (parent, { productName, imageUrl, price }) => {
      try {
        let productFound = await Product.findOne({ productName: productName });
        if (productFound) {
          const productUpdate = await Product.findOneAndUpdate(
            { productName: productName },
            { imageUrl: imageUrl, price: price },
            { new: true }
          );
          return productUpdate;
        }

        const product = await Product.create({
          productName,
          imageUrl,
          price,
        });
        return product;
      } catch (err) {
        throw new Error("Something went wrong");
      }
    },
    addFavourite: async (parent, { productName }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to add favourites"
        );
      }
      try {
        ///find a product with the product name passed
        let productFound = await Product.findOne({ productName: productName });

        if (!productFound) {
          throw new Error("Product not found");
        }
        //create a nwe favourite
        const favourite = await Favourite.create({
          productId: productFound._id,
          isFavourite: true,
          userId: context.user._id,
        });
        //find the logged in user in the database and push the new favourite
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $push: {
              favourites: {
                _id: favourite._id,
              },
            },
          },
          { new: true }
        ).populate("favourites");

        return user;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to add favorite product");
      }
    },
    removeFavourite: async (parent, { productName }, context) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to remove favourites"
        );
      }

      try {
        ///find a product with the product name passed
        const product = await Product.findOne({ productName });

        if (!product) {
          throw new Error("Product not found");
        }
        //find a product with the product id and user _id
        const favourite = await Favourite.findOne({
          productId: product._id,
          userId: context.user._id,
        });

        if (!favourite) {
          throw new Error("Favourite not found");
        }

        const user = await User.findById(context.user._id);

        if (!user) {
          throw new Error("User not found");
        }
        //remove the favourite object with the favourite _id from the user's favourites array
        user.favourites = user.favourites.filter(
          (f) => f.toString() !== favourite._id.toString()
        );

        await user.save();
        await favourite.remove();

        return user;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to remove favorite product");
      }
    },
  },
};

module.exports = resolvers;
