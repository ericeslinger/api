'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = exports.rootSchema = undefined;

var _graphqlTools = require('graphql-tools');

var _language = require('graphql/language');

var _users = require('./users.schema');

const rootSchema = exports.rootSchema = `
  schema {
    query: Query
  }
`;
const schema = exports.schema = (0, _graphqlTools.makeExecutableSchema)({
    typeDefs: [_users.usersSchema],
    resolvers: {
        Date: {
            __parseValue(value) {
                return new Date(value); // value from the client
            },
            __serialize(value) {
                return value.getTime(); // value sent to the client
            },
            __parseLiteral(ast) {
                if (ast.kind === _language.Kind.INT) {
                    return parseInt(ast.value, 10); // ast value is always in string format
                }
                return null;
            }
        }
    }
});