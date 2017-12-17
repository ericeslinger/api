'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.baseSchema = undefined;

var _graphqlTools = require('graphql-tools');

var _users = require('./users.schema');

var _profiles = require('./profiles.schema');

var _communities = require('./communities.schema');

var _posts = require('./posts.schema');

var _graphqlTypeJson = require('graphql-type-json');

var _graphqlIsoDate = require('graphql-iso-date');

const baseSchema = exports.baseSchema = `
  scalar DateTime
  scalar JSON
  interface Node {
    id: ID!
  }
  type Query {
    node(id: ID!): Node
  }
  schema {
    query: Query
  }
`;
const schema = exports.schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: [baseSchema, _users.usersSchema, _profiles.profilesSchema, _posts.postsSchema, _communities.communitiesSchema],
  resolvers: {
    DateTime: _graphqlIsoDate.GraphQLDateTime,
    JSON: _graphqlTypeJson.JSONScalar
  }
});