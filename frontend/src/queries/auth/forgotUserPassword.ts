import { gql } from "@apollo/client";

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotUserPassword($input: ForgotPasswordInput!) {
    forgotUserPassword(input: $input) {
      token
    }
  }
`;
