import { gql } from "apollo-server";

export const userSchema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    avatarUrl: String
    googleId: String
    acceptTerms: Boolean!
    isVerified: String!
    authProvider: String!
    hasPassword: Boolean!
    twoFactorEnabled: Boolean!
  }

  type AuthResponse {
    token: String
    user: User
  }

  type UserResponse {
    success: Boolean
    message: String
    user: User
    token: String
    deletedUser: User
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
    oldPassword: String
    avatarUrl: String
    twoFactorEnabled: Boolean
  }

  input SetUserPasswordInput {
    password: String!
  }

  input UpdateUserAvatarInput {
    avatarUrl: String!
  }

  input getPresignedUrlInput {
    fileName: String!
    fileType: String!
  }

  type PresignedUrlResponse {
    uploadUrl: String!
    fileUrl: String!
  }

  type Query {
    getUserData: UserResponse!
  }

  type Mutation {
    deleteUserData: UserResponse!
    updateUserData(input: UpdateUserInput): UserResponse!
    setUserPassword(input: SetUserPasswordInput): UserResponse!
    updateUserAvatar(input: UpdateUserAvatarInput): UserResponse!
    getPresignedUrl(input: getPresignedUrlInput): PresignedUrlResponse!
  }
`;
