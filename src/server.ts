import Hapi from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import { schema } from './schemas/index';

const HOST = 'localhost';
const PORT = 3000;

process.on('unhandledRejection', r => console.log(r));

async function StartServer() {
  const server = new Hapi.server({
    host: HOST,
    port: PORT,
  });

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: async request => ({
        schema: schema,
        context: request,
      }),
      route: {
        cors: true,
        pre: [
          {
            method: async req => {
              console.log('REEEEEQUEEESSST');
              return true;
            },
            assign: 'loaders',
          },
        ],
      },
    },
  });

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql',
        schema: schema,
      },
      route: {
        cors: true,
      },
    },
  });

  try {
    await server.start();
  } catch (err) {
    console.log(`Error while starting server: ${err.message}`);
  }

  console.log(`Server running at: ${server.info.uri}`);
}

StartServer();
