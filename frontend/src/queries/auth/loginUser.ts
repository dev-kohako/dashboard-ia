import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        name
        email
        avatarUrl
        authProvider
        hasPassword
        twoFactorEnabled
      }
    }
  }
`;
