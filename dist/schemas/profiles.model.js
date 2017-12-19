'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;
exports.makeProfileResolver = makeProfileResolver;

var _load = require('./load');

var _resolver = require('./resolver');

const schema = exports.schema = (0, _load.loadSchema)('profiles.graphql');
function makeProfileResolver(db) {
    const r = new _resolver.Resolver(db, 'florence.profiles');
    return {
        Query: {
            profiles: (obj, args, context, info) => r.getAll()
        },
        Profile: {
            users: r.join({
                joinTable: 'florence.profiles_users_join',
                thatField: 'user_id',
                thisField: 'profile_id',
                otherTable: 'florence.users'
            })
        }
    };
}