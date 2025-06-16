import { gql } from 'apollo-server';

export const tagSchema = gql`
  type Tag {
    id: ID!
    name: String!
    color: String!
  }

  input CreateTagInput {
    name: String!
    color: String
  }

  input UpdateTagInput {
    tagId: ID!
    name: String
    color: String
  }

  type listTags {
    tags: [Tag!]!
  }

  input DeleteTagInput {
    tagId: ID!
  }

  input addTagToTaskInput {
    taskId: ID!
    tagId: ID!
  }

  type TagResponse {
    tag: Tag
    message: String!
  }

  type Query {
    listTags: [Tag!]!
  }

  type Mutation {
    createTag(input: CreateTagInput!): TagResponse!
    updateTag(input: UpdateTagInput!): TagResponse!
    deleteTag(input: DeleteTagInput!): TagResponse!
    addTagToTask(input: addTagToTaskInput!): TagResponse!
  }
`;
