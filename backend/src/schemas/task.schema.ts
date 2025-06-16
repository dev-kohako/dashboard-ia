import { gql } from 'apollo-server';

export const taskSchema = gql`
  enum TaskState {
    TODO
    IN_PROGRESS
    DONE
    EXPIRED
    CANCELED
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum SortOrder {
    asc
    desc
  }

  scalar Date

  type Tag {
    id: ID!
    name: String!
    color: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    state: TaskState!
    priority: TaskPriority!
    dueDate: Date
    createdAt: Date!
    updatedAt: Date!
    userId: ID!
    tags: [Tag!]!
  }
  type TaskHistory {
    id: ID!
    taskId: ID!
    changedBy: ID!
    changeType: String!
    previousState: TaskState
    newState: TaskState
    changedAt: Date!
    user: User!
  }

  type TaskStats {
    total: Int!
    todo: Int!
    inProgress: Int!
    done: Int!
    expired: Int!
    canceled: Int!
  }

  type TaskResponse {
    task: Task
    tasks: [Task]
    totalCount: Int
    message: String
  }

  input CreateTaskInput {
    title: String!
    description: String
    state: TaskState!
    priority: TaskPriority!
    dueDate: Date
    tagIds: [ID!]
  }

  input UpdateTaskInput {
    taskId: ID!
    title: String
    description: String
    state: TaskState
    priority: TaskPriority
    dueDate: Date
    tagIds: [ID!]
  }

  input GetTaskSortByInput {
    title: String
    state: TaskState
    priority: TaskPriority
    dueDateFrom: Date
    dueDateTo: Date
    order: SortOrder
    orderBy: String
    limit: Int
    page: Int
  }

  input DeleteTaskInput {
    taskId: ID!
  }

  input GetTaskInput {
    taskId: ID!
  }

  input DuplicateTaskInput {
    taskId: ID!
  }

  type Query {
    getTask(input: GetTaskInput!): TaskResponse!
    getTaskSortBy(input: GetTaskSortByInput!): TaskResponse!
    getTaskStats: TaskStats!
    getTaskHistory(taskId: ID!): [TaskHistory!]!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): TaskResponse!
    duplicateTask(input: DuplicateTaskInput!): TaskResponse!
    updateTask(input: UpdateTaskInput!): TaskResponse!
    deleteTask(input: DeleteTaskInput!): TaskResponse!
  }
`;
