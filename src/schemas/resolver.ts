import Knex from 'knex';

export class Resolver {
  constructor(public db: Knex, public table: string) {}
  join(args: {
    joinTable: string;
    otherTable: string;
    thisField: string;
    thatField: string;
  }) {
    return (obj, _args, context, info) => {
      console.log(context.pre);
      return this.db(args.joinTable)
        .join(
          args.otherTable,
          `${args.joinTable}.${args.thatField}`,
          '=',
          `${args.otherTable}.id`,
        )
        .where({ [args.thisField]: obj.id })
        .select(`${args.otherTable}.*`);
    };
  }
  getById(id: string) {
    return this.db(this.table)
      .where({ id })
      .select('*');
  }
  getByIds(ids: string[]) {
    return this.db(this.table)
      .whereIn('id', ids)
      .select('*');
  }
  getAll() {
    return this.db(this.table).select('*');
  }
}
