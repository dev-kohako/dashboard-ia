import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $acceptTerms: String!) {
    register(name: $name, email: $email, password: $password, acceptTerms: $acceptTerms) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;
