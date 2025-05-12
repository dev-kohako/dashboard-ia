import { gql } from "@apollo/client";

export const UPDATE_AVATAR_MUTATION = gql`
  mutation UpdateUserAvatar($input: UpdateUserAvatarInput!) {
    updateUserAvatar(input: $input) {
      success
      message
    }
  }
`;