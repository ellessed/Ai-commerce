import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
    }
  }
`;

export const QUERY_SINGLE_PRODUCT = gql`
  query Product($productId: ID!) {
    product(productId: $productId) {
      _id
      imageUrl
      price
      productName
    }
  }
`;

export const QUERY_FEATURED_PRODUCTS = gql`
  query Products {
    products {
      _id
      title
      description
      image
      price
      createdAt
    }
  }
`;

export const QUERY_USER_FAVOURITES = gql`
  query Query($productName: String!) {
    getFavourites(productName: $productName)
  }
`;

export const QUERY_ME = gql`
  query Me {
    me {
      favourites {
        _id
        isFavourite
        productId {
          _id
          imageUrl
          price
          productName
        }
      }
      orders {
        items {
          _id
          imageUrl
          price
          productName
        }
      }
      _id
      username
      email
    }
  }
`;

export const QUERY_SEARCH = gql`
  query RecentArt {
    recentArt {
      recentArt {
        _id
        productName
        price
        imageUrl
      }
    }
  }
`;
