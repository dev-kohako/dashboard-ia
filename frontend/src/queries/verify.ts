import { gql } from "@apollo/client";

export const VERIFY_MUTATION = gql`
  mutation Verify($userId: String!, $code: String!) {
    verify(userId: $userId, code: $code) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;