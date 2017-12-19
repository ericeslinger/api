'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;
exports.makeUserResolver = makeUserResolver;

var _load = require('./load');

var _resolver = require('./resolver');

const schema = exports.schema = (0, _load.loadSchema)('users.graphql');
function makeUserResolver(db) {
    const r = new _resolver.Resolver(db, 'florence.users');
    return {
        Query: {
            users: (obj, args, context, info) => r.getAll()
        },
        User: {
            profiles: r.join({
                joinTable: 'florence.profiles_users_join',
                thisField: 'user_id',
                thatField: 'profile_id',
                otherTable: 'florence.profiles'
            })
        }
    };
}