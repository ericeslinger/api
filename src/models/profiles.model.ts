import Knex from 'knex';

import { loadSchema } from './load';
import { Model } from './model';

export class ProfileModel extends Model {
  static opts = {
    // schema: loadSchema('profiles.graphql'),
    table: 'florence.profiles',
    name: 'Profile',
    pluralName: 'profiles',
    lowerName: 'profile',
    joins: {
      users: {
        joinTable: 'florence.profiles_users_join',
        thisField: 'profile_id',
        thatField: 'user_id',
        thatName: 'User',
      },
    },
  };
}
