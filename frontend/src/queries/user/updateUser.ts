import { gql } from "@apollo/client";

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserData($input: UpdateUserInput!) {
    updateUserData(input: $input) {
      success
      message
      token
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
