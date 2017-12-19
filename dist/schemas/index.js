'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = exports.baseSchema = undefined;

var _graphqlTools = require('graphql-tools');

var _mergeOptions = require('merge-options');

var _mergeOptions2 = _interopRequireDefault(_mergeOptions);

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _fs = require('fs');

var _path = require('path');

var _graphqlTypeJson = require('graphql-type-json');

var _graphqlTypeJson2 = _interopRequireDefault(_graphqlTypeJson);

var _graphqlIsoDate = require('graphql-iso-date');

var _users = require('./users.model');

var _profiles = require('./profiles.model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function load(fn) {
    return (0, _fs.readFileSync)((0, _path.join)(__dirname, fn)).toString();
}
const client = (0, _knex2.default)({
    client: 'pg',
    debug: true,
    connection: {
        database: 'florence',
        user: 'flo',
        host: 'localhost',
        port: 5432,
        password: 'fumfum'
    }
});
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
    resolvers: (0, _mergeOptions2.default)({}, {
        DateTime: _graphqlIsoDate.GraphQLDateTime,
        JSON: _graphqlTypeJson2.default
    }, (0, _profiles.makeProfileResolver)(client), (0, _users.makeUserResolver)(client))
});