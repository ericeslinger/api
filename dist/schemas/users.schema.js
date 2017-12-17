"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const usersSchema = exports.usersSchema = `

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