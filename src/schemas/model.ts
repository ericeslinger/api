import Knex from 'knex';
import Dataloader from 'dataloader';
import camelcase from 'camelcase';

export interface JoinData {
  joinTable: string;
  thatName: string;
  thisField: string;
  thatField: string;
}

export interface ModelOptions {
  table: string;
  name: string;
  pluralName: string;
  lowerName: string;
  joins: { [key: string]: JoinData };
  schema: string;
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
        [this.opts.pluralName]: (obj, args, context, info) => this.getAll(),
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
    return rv;
  }

  // utility methods for building resolvers
  join(args: JoinData) {
    return async (obj, _args, context, info) => {
      const toLoad = await this.db(args.joinTable)
        .where({ [args.thisField]: obj.id })
        .select(args.thatField);
      return await context.pre.loaders[args.thatName].loadMany(
        toLoad.map(v => v[args.thatField]),
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
  getByIds(ids: string[]) {
    return Promise.resolve<any[]>(
      this.db(this.opts.table)
        .whereIn('id', ids)
        .select('*'),
    );
  }
  getAll() {
    return this.db(this.opts.table).select('*');
  }

  static opts: ModelOptions;
}
