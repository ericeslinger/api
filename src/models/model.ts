import Knex from 'knex';
import Dataloader from 'dataloader';
import camelcase from 'camelcase';

export interface JoinData {
  joinTable: string;
  thatName: string;
  thisField: string;
  thatField: string;
  filters?: {
    [field: string]: string;
  };
}

export interface ModelOptions {
  table: string;
  name: string;
  pluralName: string;
  lowerName: string;
  joins: { [key: string]: JoinData };
  schema?: string;
}

export function ccMap(arg: { [key: string]: any }) {
  return Object.keys(arg).reduce(
    (acc, curr) => Object.assign(acc, { [camelcase(curr)]: arg[curr] }),
    {},
  );
}

export class Model {
  get schema() {
    return this.opts.schema;
  }

  get opts(): ModelOptions {
    return this.constructor['opts'];
  }

  constructor(public db: Knex) {}

  loader(): Dataloader<string, any> {
    return new Dataloader(
      (ids: string[]) => this.getByIds(ids) as Promise<any[]>,
    );
  }

  querySchema() {
    const rv = {
      Query: {
        [this.opts.pluralName]: async (obj, args, context, info) => {
          const ids = await this.getAllIds();
          return ids.map(v => context.pre.loaders[this.opts.name].load(v));
        },
        [this.opts.lowerName]: (obj, args, context, info) => {
          return context.pre.loaders[this.opts.name].load(args.id);
        },
      },
    };
    Object.keys(this.opts.joins).forEach(join => {
      if (!rv[this.opts.name]) {
        rv[this.opts.name] = {};
      }
      rv[this.opts.name][join] = this.join(this.opts.joins[join]);
    });
    console.log(Object.keys(rv));
    return rv;
  }

  // utility methods for building resolvers
  join(opts: JoinData) {
    return async (obj, args, context, info) => {
      const toLoad = await Object.keys(opts.filters)
        .reduce(
          (acc, curr) => acc.where(curr, opts.filters[curr], args[curr]),
          this.db(opts.joinTable).where({ [opts.thisField]: obj.id }),
        )
        .select('*');
      return toLoad.map(v =>
        Object.assign(v, { __type: opts.thatName, __id: opts.thatField }),
      );
    };
  }
  getById(id: string): Promise<any> {
    return Promise.resolve<any>(
      this.db(this.opts.table)
        .where({ id: id })
        .select('*')
        .then(v => v[0] || null),
    );
  }
  async getByIds(ids: string[]) {
    const init = await this.db(this.opts.table)
      .whereIn('id', ids)
      .select('*');
    return ids
      .map(id => init.find(v => v.id === id) || null)
      .map(v => (v ? ccMap(v) : v));
  }
  getAll() {
    return this.db(this.opts.table).select('*');
  }
  async getAllIds() {
    const idObj = await this.db(this.opts.table).select('id');
    return idObj.map(v => v.id);
  }

  static opts: ModelOptions;
}
