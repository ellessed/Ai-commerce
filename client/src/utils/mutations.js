import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CHECKOUT = gql`
  mutation checkout($amount: Int) {
    checkout(amount: $amount) {
      id
      client_secret
    }
  }
`;

export const SAVE_ARTWORK = gql`
  mutation SaveArtwork($artData: ArtInput!) {
    saveArtwork(artData: $artData) {
      _id
      username
      email
      recentArt {
        productName
        imageUrl
        price
      }
    }
  }
`;
