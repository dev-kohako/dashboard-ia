import { gql } from "@apollo/client";

export const SET_USER_PASSWORD_MUTATION = gql`
  mutation SetUserPassword($input: SetUserPasswordInput!) {
    setUserPassword(input: $input) {
        success
        message
    }
  }
`;