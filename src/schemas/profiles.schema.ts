export const profilesSchema = `
  extend type Query {
    profiles: [Profile]
  }

  type Profile implements Node {
    id: ID!
    name: String!
    about: JSON!
    draft: JSON!
    users: [User]
    posts: [Post]
    memberships: [Community]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
