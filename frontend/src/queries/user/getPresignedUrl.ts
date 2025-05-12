import { gql } from "@apollo/client";

export const GET_PRESIGNED_URL_MUTATION = gql`
  mutation GetPresignedUrl($input: getPresignedUrlInput!) {
    getPresignedUrl(input: $input) {
      uploadUrl
      fileUrl
    }
  }
`;