import { gql } from 'apollo-server'

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    acceptTerms: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, acceptTerms: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    verify(userId: String!, code: String!): AuthPayload!
    forgotPassword(email: String!): AuthPayload!
    resetPassword(token: String!, newPassword: String!): AuthPayload!
  }
`
