'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.APIServer = undefined;

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _apolloServerHapi = require('apollo-server-hapi');

var _index = require('./schemas/index');

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HOST = 'localhost';
const PORT = 3000;
process.on('unhandledRejection', r => console.log(r));
class APIServer {
    constructor() {
        this.server = new _hapi2.default.server({ host: HOST, port: PORT });
    }
    async start(withUI) {
        this.knex = (0, _knex2.default)({
            client: 'pg',
            debug: false,
            connection: {
                database: 'florence',
                user: 'flo',
                host: 'localhost',
                port: 5432,
                password: 'fumfum'
            }
        });
        const memoSchema = (0, _index.schema)(this.knex);
        await this.server.register({
            plugin: _apolloServerHapi.graphqlHapi,
            options: {
                path: '/graphql',
                graphqlOptions: async request => ({
                    schema: memoSchema,
                    context: request
                }),
                route: {
                    cors: true,
                    pre: [{
                        method: async req => {
                            return true;
                        },
                        assign: 'loaders'
                    }]
                }
            }
        });
        if (withUI) {
            await this.server.register({
                plugin: _apolloServerHapi.graphiqlHapi,
                options: {
                    path: '/graphiql',
                    graphiqlOptions: {
                        endpointURL: '/graphql',
                        schema: memoSchema
                    },
                    route: {
                        cors: true
                    }
                }
            });
        }
        await this.server.start();
        console.log(`listening on http://localhost:3000/graphiql`);
    }
    async stop() {
        console.log('stopping');
        await this.knex.destroy();
        return this.server.stop();
    }
}
exports.APIServer = APIServer;