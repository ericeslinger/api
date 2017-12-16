export const usersSchema = `
  scalar Date

  type Query {
    users: [User]
    userById(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
    createdAt: Date
    updatedAt: Date
  }
`;
