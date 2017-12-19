import { loadSchema } from './load';
import { Resolver } from './resolver';
import Knex from 'knex';

export const schema = loadSchema('users.graphql');

export function makeUserResolver(db: Knex) {
  const r = new Resolver(db, 'florence.users');
  return {
    Query: {
      users: (obj, args, context, info) => r.getAll(),
    },
    User: {
      profiles: r.join({
        joinTable: 'florence.profiles_users_join',
        thisField: 'user_id',
        thatField: 'profile_id',
        otherTable: 'florence.profiles',
      }),
    },
  };
}
