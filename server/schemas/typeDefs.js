const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    orders: [Order]!
    recentArt: [Product]!
    favourites: [Product]!
  }

  type Product {
    _id: ID
    productName: String
    imageUrl: String
    price: Int
  }

  type Category {
    _id: ID
    name: String
    createdAt: String
    products: [Product]!
  }

  type Order {
    _id: ID
    customerName: String
    customerAddress: String
    total: Int
    items: [Product]!
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Payment {
    id: String
    client_secret: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    categories: [Category]
    category(name: String!): Category
    me: User
    products: [Product]
    product(productId: ID!): Product
    orders: [Order]
    order(orderId: ID!): Order
    recentArt: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    newOrder(
      customerName: String!
      customerAddress: String!
      items: String!
      total: Int!
    ): Order
    checkout(amount: Int): Payment
    addRecentArt(productName: String!, imageUrl: String!, price: Int!): Product!
    addProduct(productName: String!, imageUrl: String!, price: Int): Product!
    addFavourite(productName: String!): User!
  }
`;

module.exports = typeDefs;
