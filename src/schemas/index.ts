import { makeExecutableSchema } from 'graphql-tools';
import mergeOptions from 'merge-options';
import Knex from 'knex';

import { readFileSync } from 'fs';
import { join } from 'path';

import JSONScalar from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';

import { makeUserResolver } from './users.model';
import { makeProfileResolver } from './profiles.model';

function load(fn: string) {
  return readFileSync(join(__dirname, fn)).toString();
}

export const baseSchema = `
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

export function schema(client: Knex) {
  console.log('schema called');
  return makeExecutableSchema({
    typeDefs: [
      baseSchema,
      load('communities.graphql'),
      load('users.graphql'),
      load('profiles.graphql'),
      load('posts.graphql'),
    ],
    resolvers: mergeOptions(
      {},
      {
        DateTime: GraphQLDateTime,
        JSON: JSONScalar,
      },
      makeProfileResolver(client),
      makeUserResolver(client),
    ),
  });
}
