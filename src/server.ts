import Hapi from 'hapi';
import { graphqlHapi, graphiqlHapi } from 'apollo-server-hapi';
import gql from 'graphql-tag';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLID,
} from 'graphql';

const HOST = 'localhost';
const PORT = 3000;

process.on('unhandledRejection', r => console.log(r));

const personType = new GraphQLObjectType({
  name: 'Person',
  description: 'A member of a community',
  fields: {
    id: {
      type: GraphQLID,
      description: 'unique id',
    },
    name: {
      type: GraphQLString,
      description: 'AKA short_text',
    },
  },
});

const queryType = new GraphQLObjectType({
  name: 'Root',
  description: 'the root query',
  fields: {
    person: {
      type: personType,
      resolve: async () => ({
        name: 'Eric',
        id: 'people:1',
      }),
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
});

async function StartServer() {
  const server = new Hapi.server({
    host: HOST,
    port: PORT,
  });

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema: schema,
      },
      route: {
        cors: true,
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
