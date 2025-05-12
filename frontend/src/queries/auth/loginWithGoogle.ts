import { gql } from "@apollo/client";

export const GOOGLE_LOGIN_MUTATION = gql`
  mutation GoogleLogin($input: LoginWithGoogleInput!) {
    loginWithGoogle(input: $input) {
      token
      user {
        id
        name
        email
        authProvider
      }
    }
  }
`;