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
            users: (obj, args, context, info) => {
                return db('florence.profiles_users_join').join('florence.users', 'florence.profiles_users_join.user_id', '=', 'florence.users.id').where({ 'florence.profiles_users_join.profile_id': obj.id }).select('florence.users.*');
            }
        }
    };
}