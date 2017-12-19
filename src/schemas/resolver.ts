import Knex from 'knex';

export class Resolver {
  constructor(public db: Knex, public table: string) {}
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
