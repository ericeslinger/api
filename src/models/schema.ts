import JSONScalar from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import mergeOptions from 'merge-options';
import Knex from 'knex';
import { makeExecutableSchema } from 'graphql-tools';
import { loadSchema } from './load';
import { Model } from './model';

export function schema(client: Knex, models: Model[]) {
  const resolvers = [
    {},
    {
      DateTime: GraphQLDateTime,
      JSON: JSONScalar,
    },
  ].concat(models.map(model => model.querySchema()));
  return makeExecutableSchema({
    typeDefs: [loadSchema('schema.graphql')],
    resolvers: mergeOptions(...resolvers),
  });
}
