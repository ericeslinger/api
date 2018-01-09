'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = schema;

var _graphqlTypeJson = require('graphql-type-json');

var _graphqlTypeJson2 = _interopRequireDefault(_graphqlTypeJson);

var _graphqlIsoDate = require('graphql-iso-date');

var _mergeOptions = require('merge-options');

var _mergeOptions2 = _interopRequireDefault(_mergeOptions);

var _graphqlTools = require('graphql-tools');

var _load = require('./load');

var _relationship = require('./relationship');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function schema(client, models) {
    const profileUser = new _relationship.Relationship(client, {
        tableName: 'profiles_users_join',
        members: {
            user: 'user_id',
            profile: 'profile_id'
        },
        typeName: 'ProfileUserRelationship'
    });
    const resolvers = [{}, {
        DateTime: _graphqlIsoDate.GraphQLDateTime,
        JSON: _graphqlTypeJson2.default,
        ProfileUserRelationship: profileUser.resolver()
    }].concat(models.map(model => model.querySchema()));
    console.log(resolvers);
    return (0, _graphqlTools.makeExecutableSchema)({
        typeDefs: [(0, _load.loadSchema)('schema.graphql')],
        resolvers: (0, _mergeOptions2.default)(...resolvers)
    });
}