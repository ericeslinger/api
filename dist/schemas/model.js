'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Model = undefined;

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Model {
    constructor(db) {
        this.db = db;
    }
    get schema() {
        return this.opts.schema;
    }
    get opts() {
        return this.constructor['opts'];
    }
    loader() {
        return new _dataloader2.default(ids => this.getByIds(ids));
    }
    querySchema() {
        const rv = {
            Query: {
                [this.opts.pluralName]: (obj, args, context, info) => this.getAll(),
                [this.opts.lowerName]: (obj, args, context, info) => {
                    return context.pre.loaders[this.opts.name].load(args.id);
                }
            }
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
    join(args) {
        return async (obj, _args, context, info) => {
            const toLoad = await this.db(args.joinTable).where({ [args.thisField]: obj.id }).select(args.thatField);
            return await context.pre.loaders[args.thatName].loadMany(toLoad.map(v => v[args.thatField]));
        };
    }
    getById(id) {
        return Promise.resolve(this.db(this.opts.table).where({ id: id }).select('*').then(v => v[0] || null));
    }
    getByIds(ids) {
        return Promise.resolve(this.db(this.opts.table).whereIn('id', ids).select('*'));
    }
    getAll() {
        return this.db(this.opts.table).select('*');
    }
}
exports.Model = Model;