import JSONScalar from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import mergeOptions from 'merge-options';
import Knex from 'knex';
import { makeExecutableSchema } from 'graphql-tools';
import { loadSchema } from './load';
import { Model } from './model';
import { Relationship } from './relationship';

export function schema(client: Knex, models: Model[]) {
  const profileUser = new Relationship(client, {
    tableName: 'profiles_users_join',
    members: {
      user: 'user_id',
      profile: 'profile_id',
    },
    typeName: 'ProfileUserRelationship',
  });

  const resolvers = [
    {},
    {
      DateTime: GraphQLDateTime,
      JSON: JSONScalar,
      ProfileUserRelationship: profileUser.resolver(),
    },
  ].concat(models.map(model => model.querySchema()));
  console.log(resolvers);
  return makeExecutableSchema({
    typeDefs: [loadSchema('schema.graphql')],
    resolvers: mergeOptions(...resolvers),
  });
}
