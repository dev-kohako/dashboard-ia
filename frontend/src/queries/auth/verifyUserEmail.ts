import { gql } from "@apollo/client";

export const VERIFY_MUTATION = gql`
  mutation VerifyUserEmail($input: VerifyEmailInput!) {
    verifyUserEmail(input: $input) {
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