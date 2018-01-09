'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Model = undefined;
exports.ccMap = ccMap;

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ccMap(arg) {
    return Object.keys(arg).reduce((acc, curr) => Object.assign(acc, { [(0, _camelcase2.default)(curr)]: arg[curr] }), {});
}
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
                [this.opts.pluralName]: async (obj, args, context, info) => {
                    const ids = await this.getAllIds();
                    return ids.map(v => context.pre.loaders[this.opts.name].load(v));
                },
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
        console.log(Object.keys(rv));
        return rv;
    }
    // utility methods for building resolvers
    join(opts) {
        return async (obj, args, context, info) => {
            const toLoad = await Object.keys(opts.filters).reduce((acc, curr) => acc.where(curr, opts.filters[curr], args[curr]), this.db(opts.joinTable).where({ [opts.thisField]: obj.id })).select('*');
            return toLoad.map(v => Object.assign(v, { __type: opts.thatName, __id: opts.thatField }));
        };
    }
    getById(id) {
        return Promise.resolve(this.db(this.opts.table).where({ id: id }).select('*').then(v => v[0] || null));
    }
    async getByIds(ids) {
        const init = await this.db(this.opts.table).whereIn('id', ids).select('*');
        return ids.map(id => init.find(v => v.id === id) || null).map(v => v ? ccMap(v) : v);
    }
    getAll() {
        return this.db(this.opts.table).select('*');
    }
    async getAllIds() {
        const idObj = await this.db(this.opts.table).select('id');
        return idObj.map(v => v.id);
    }
}
exports.Model = Model;