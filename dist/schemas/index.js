'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = exports.baseSchema = undefined;

var _graphqlTools = require('graphql-tools');

var _fs = require('fs');

var _path = require('path');

var _graphqlTypeJson = require('graphql-type-json');

var _graphqlTypeJson2 = _interopRequireDefault(_graphqlTypeJson);

var _graphqlIsoDate = require('graphql-iso-date');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function load(fn) {
    return (0, _fs.readFileSync)((0, _path.join)(__dirname, fn)).toString();
}
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
    typeDefs: [baseSchema, load('communities.graphql'), load('users.graphql'), load('profiles.graphql'), load('posts.graphql')],
    resolvers: {
        DateTime: _graphqlIsoDate.GraphQLDateTime,
        JSON: _graphqlTypeJson2.default
    }
});