import { loadSchema } from './load';
import { Resolver } from './resolver';
import Knex from 'knex';

export const schema = loadSchema('profiles.graphql');

export function makeProfileResolver(db: Knex) {
  const r = new Resolver(db, 'florence.profiles');
  return {
    Query: {
      profiles: (obj, args, context, info) => r.getAll(),
    },
    Profile: {
      users: r.join({
        joinTable: 'florence.profiles_users_join',
        thatField: 'user_id',
        thisField: 'profile_id',
        otherTable: 'florence.users',
      }),
    },
  };
}
