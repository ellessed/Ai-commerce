require("dotenv").config();
const { AuthenticationError } = require("apollo-server-express");
const { User, Product, Order } = require("../models");
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
        return User.findOne({ _id: context.user._id })
          .populate("recentArt")
          .populate("favourites");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    recentArt: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("recentArt");
      }
      throw new AuthenticationError("You need to be logged in!");
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
        let productFound = await Product.findOne({ productName: productName });

        if (productFound) {
          const user = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: {
                favourites: {
                  _id: productFound._id,
                },
              },
            },
            { new: true }
          ).populate("favourites.product");

          return user;
        }
      } catch (err) {
        console.error(err);
        throw new Error("Failed to add favorite product");
      }
    },
  },
};

module.exports = resolvers;
