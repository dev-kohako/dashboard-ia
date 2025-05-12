import { gql } from "@apollo/client";

export const GET_USER_QUERY = gql`
  query GetUserData {
    getUserData {
      user {
        id
        name
        email
        avatarUrl
        authProvider
        isVerified
        hasPassword
        twoFactorEnabled
      }
    }
  }
`;
