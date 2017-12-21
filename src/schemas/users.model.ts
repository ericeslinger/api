import Knex from 'knex';

import { loadSchema } from './load';
import { Model } from './model';

export class UserModel extends Model {
  static opts = {
    schema: loadSchema('users.graphql'),
    table: 'florence.users',
    name: 'User',
    pluralName: 'users',
    lowerName: 'user',
    joins: {
      profiles: {
        joinTable: 'florence.profiles_users_join',
        thisField: 'user_id',
        thatField: 'profile_id',
        thatName: 'Profile',
      },
    },
  };
}
