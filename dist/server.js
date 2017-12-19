'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _apolloServerHapi = require('apollo-server-hapi');

var _index = require('./schemas/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HOST = 'localhost';
const PORT = 3000;
process.on('unhandledRejection', r => console.log(r));
async function StartServer() {
    const server = new _hapi2.default.server({
        host: HOST,
        port: PORT
    });
    await server.register({
        plugin: _apolloServerHapi.graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: async request => ({
                schema: _index.schema,
                context: request
            }),
            route: {
                cors: true,
                pre: [{
                    method: async req => {
                        console.log('REEEEEQUEEESSST');
                        return true;
                    },
                    assign: 'loaders'
                }]
            }
        }
    });
    await server.register({
        plugin: _apolloServerHapi.graphiqlHapi,
        options: {
            path: '/graphiql',
            graphiqlOptions: {
                endpointURL: '/graphql',
                schema: _index.schema
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