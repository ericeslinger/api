export const usersSchema = `

  extend type Query {
    users: [User]
  }

  type User implements Node {
    id: ID!
    name: String!
    profiles: [Profile]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
