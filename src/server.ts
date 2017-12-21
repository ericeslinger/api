import Hapi from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import { schema } from './schemas/index';
import Knex from 'knex';
import mergeOptions from 'merge-options';

const HOST = 'localhost';
const PORT = 3000;

import { Model, UserModel, ProfileModel } from './schemas';
process.on('unhandledRejection', r => console.log(r));

export class APIServer {
  server = new Hapi.server({ host: HOST, port: PORT });
  knex: Knex;

  async start(withUI: boolean) {
    this.knex = Knex({
      client: 'pg',
      debug: true,
      connection: {
        database: 'florence',
        user: 'flo',
        host: 'localhost',
        port: 5432,
        password: 'fumfum',
      },
    });

    const userModel = new UserModel(this.knex);
    const modelTypes: typeof Model[] = [UserModel, ProfileModel];
    const models = modelTypes.map(T => new T(this.knex));
    const memoSchema = schema(this.knex, models);

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
              method: async req =>
                mergeOptions(
                  ...models.map(model => ({
                    [model.opts.name]: model.loader(),
                  })),
                ),
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
