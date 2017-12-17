export const communitiesSchema = `
  extend type Query {
    communities: [Community]
  }

  type Community implements Node {
    id: ID!
    name: String!
    description: JSON!
    draft: JSON!
    members: [Profile]
    moderators: [Profile]
    conversations: [Post]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
