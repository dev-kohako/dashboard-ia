import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      message
      user {
        id
        name
        email
      }
    }
  }
`;
