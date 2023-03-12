require("dotenv").config();
const { AuthenticationError } = require("apollo-server-express");
const { User, Product, Category, Order } = require("../models");
const { signToken } = require("../utils/auth");

const stripe = require("stripe")(process.env.PRIVATE_API_KEY);

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("orders");
    },
    categories: async () => {
      return Category.find();
    },
    category: async (parent, { name }) => {
      return Category.findOne({ name: name }).populate("products");
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
        return User.findOne({ _id: context.user._id }).populate("orders");
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
    saveArtwork: async (parent, { productName, imageUrl, price }) => {
      const product = new Product({ productName, imageUrl, price });
      await product.save();
      return product;
    },
  },
};

module.exports = resolvers;
