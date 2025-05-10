import { gql } from "apollo-server";

export const authSchema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    acceptTerms: Boolean!
    authProvider: String!
    hasPassword: Boolean!
    twoFactorEnabled: Boolean!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    acceptTerms: Boolean!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input VerifyEmailInput {
    userId: ID!
    code: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input ResetPasswordInput {
    token: String!
    newPassword: String!
  }

  input LoginWithGoogleInput {
    idToken: String!
  }

  type AuthPayload {
    token: String
    user: User
    message: String
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    loginWithGoogle(input: LoginWithGoogleInput!): AuthPayload!
    verifyUserEmail(input: VerifyEmailInput!): AuthPayload!
    forgotUserPassword(input: ForgotPasswordInput!): AuthPayload!
    resetUserPassword(input: ResetPasswordInput!): AuthPayload!
  }
`;
