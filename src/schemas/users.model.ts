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
      profiles: (obj, args, context, info) => {
        return db('florence.profiles_users_join')
          .join(
            'florence.profiles',
            'florence.profiles_users_join.profile_id',
            '=',
            'florence.profiles.id',
          )
          .where({ 'florence.profiles_users_join.user_id': obj.id })
          .select('florence.profiles.*');
      },
    },
  };
}
