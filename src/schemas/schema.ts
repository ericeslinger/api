import JSONScalar from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import mergeOptions from 'merge-options';
import Knex from 'knex';
import { makeExecutableSchema } from 'graphql-tools';
import { loadSchema } from './load';
import { Model } from './model';

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

export function schema(client: Knex, models: Model[]) {
  const resolvers = [
    {},
    {
      DateTime: GraphQLDateTime,
      JSON: JSONScalar,
    },
  ].concat(models.map(model => model.querySchema()));
  return makeExecutableSchema({
    typeDefs: [
      baseSchema,
      loadSchema('communities.graphql'),
      loadSchema('posts.graphql'),
    ].concat(models.map(model => model.schema)),
    resolvers: mergeOptions(...resolvers),
  });
}
