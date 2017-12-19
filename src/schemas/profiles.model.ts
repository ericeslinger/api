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
      users: (obj, args, context, info) => {
        return db('florence.profiles_users_join')
          .join(
            'florence.users',
            'florence.profiles_users_join.user_id',
            '=',
            'florence.users.id',
          )
          .where({ 'florence.profiles_users_join.profile_id': obj.id })
          .select('florence.users.*');
      },
    },
  };
}
