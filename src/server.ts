import Hapi from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import { schema } from './schemas/index';
import Knex from 'knex';

const HOST = 'localhost';
const PORT = 3000;

process.on('unhandledRejection', r => console.log(r));

export class APIServer {
  server = new Hapi.server({ host: HOST, port: PORT });
  knex: Knex;

  async start(withUI: boolean) {
    this.knex = Knex({
      client: 'pg',
      debug: false,
      connection: {
        database: 'florence',
        user: 'flo',
        host: 'localhost',
        port: 5432,
        password: 'fumfum',
      },
    });

    const memoSchema = schema(this.knex);

    await this.server.register({
      plugin: graphqlHapi,
      options: {
        path: '/graphql',
        graphqlOptions: async request => ({
          schema: memoSchema,
          context: request,
        }),
        route: {
          cors: true,
          pre: [
            {
              method: async req => {
                return true;
              },
              assign: 'loaders',
            },
          ],
        },
      },
    });
    if (withUI) {
      await this.server.register({
        plugin: graphiqlHapi,
        options: {
          path: '/graphiql',
          graphiqlOptions: {
            endpointURL: '/graphql',
            schema: memoSchema,
          },
          route: {
            cors: true,
          },
        },
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
