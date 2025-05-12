import { gql } from "@apollo/client";

export const DELETE_USER_MUTATION = gql`
  mutation deleteUserData {
    deleteUserData {
        success
        message
    }
  }
`;
