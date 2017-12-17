"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const communitiesSchema = exports.communitiesSchema = `
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