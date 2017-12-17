export const postsSchema = `
  extend type Query {
    posts: [Post]
  }

  type Post implements Node {
    id: ID!
    title: String!
    body: JSON!
    draft: JSON!
    communities: [Community]
    viewers: [Profile]
    commenters: [Profile]
    editors: [Profile]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
