import Knex from 'knex';

export function makeResolvers(db: Knex) {
  return {
    Query: {
      users: (root, args) => db('florence.users').select('*'),
      profiles: (root, args) => db('florence.profiles').select('*'),
      node: async (root, args) => {
        const type = await db('florence.type_lookup')
          .where({ id: args.id })
          .select('type');
        return db(`florence.${type[0].type}`)
          .where({ id: args.id })
          .select('*');
      },
    },
  };
}
