import { gql } from "@apollo/client";

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetUserPassword($input: ResetPasswordInput!) {
    resetUserPassword(input: $input) {
      message
    }
  }
`;
