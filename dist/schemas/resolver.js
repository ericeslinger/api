'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Resolver {
    constructor(db, table) {
        this.db = db;
        this.table = table;
    }
    getById(id) {
        return this.db(this.table).where({ id }).select('*');
    }
    getByIds(ids) {
        return this.db(this.table).whereIn('id', ids).select('*');
    }
    getAll() {
        return this.db(this.table).select('*');
    }
}
exports.Resolver = Resolver;