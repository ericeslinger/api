'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _apolloServerHapi = require('apollo-server-hapi');

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HOST = 'localhost';
const PORT = 3000;
process.on('unhandledRejection', r => console.log(r));
const personType = new _graphql.GraphQLObjectType({
    name: 'Person',
    description: 'A member of a community',
    fields: {
        id: {
            type: _graphql.GraphQLID,
            description: 'unique id'
        },
        name: {
            type: _graphql.GraphQLString,
            description: 'AKA short_text'
        }
    }
});
const queryType = new _graphql.GraphQLObjectType({
    name: 'Root',
    description: 'the root query',
    fields: {
        person: {
            type: personType,
            resolve: async () => ({
                name: 'Eric',
                id: 'people:1'
            })
        }
    }
});
const schema = new _graphql.GraphQLSchema({
    query: queryType
});
async function StartServer() {
    const server = new _hapi2.default.server({
        host: HOST,
        port: PORT
    });
    await server.register({
        plugin: _apolloServerHapi.graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: {
                schema: schema
            },
            route: {
                cors: true
            }
        }
    });
    await server.register({
        plugin: _apolloServerHapi.graphiqlHapi,
        options: {
            path: '/graphiql',
            graphiqlOptions: {
                endpointURL: '/graphql',
                schema: schema
            },
            route: {
                cors: true
            }
        }
    });
    try {
        await server.start();
    } catch (err) {
        console.log(`Error while starting server: ${err.message}`);
    }
    console.log(`Server running at: ${server.info.uri}`);
}
StartServer();