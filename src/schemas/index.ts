import { makeExecutableSchema } from 'graphql-tools';

import { readFileSync } from 'fs';
import { join } from 'path';

import JSONScalar from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';

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

export const schema = makeExecutableSchema({
  typeDefs: [
    baseSchema,
    load('communities.graphql'),
    load('users.graphql'),
    load('profiles.graphql'),
    load('posts.graphql'),
  ],
  resolvers: {
    DateTime: GraphQLDateTime,
    JSON: JSONScalar,
  },
});
