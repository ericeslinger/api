'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.baseSchema = undefined;
exports.schema = schema;

var _graphqlTypeJson = require('graphql-type-json');

var _graphqlTypeJson2 = _interopRequireDefault(_graphqlTypeJson);

var _graphqlIsoDate = require('graphql-iso-date');

var _mergeOptions = require('merge-options');

var _mergeOptions2 = _interopRequireDefault(_mergeOptions);

var _graphqlTools = require('graphql-tools');

var _load = require('./load');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function schema(client, models) {
    const resolvers = [{}, {
        DateTime: _graphqlIsoDate.GraphQLDateTime,
        JSON: _graphqlTypeJson2.default
    }].concat(models.map(model => model.querySchema()));
    return (0, _graphqlTools.makeExecutableSchema)({
        typeDefs: [baseSchema, (0, _load.loadSchema)('communities.graphql'), (0, _load.loadSchema)('posts.graphql')].concat(models.map(model => model.schema)),
        resolvers: (0, _mergeOptions2.default)(...resolvers)
    });
}