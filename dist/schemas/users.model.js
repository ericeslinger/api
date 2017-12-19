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
            profiles: (obj, args, context, info) => {
                return db('florence.profiles_users_join').join('florence.profiles', 'florence.profiles_users_join.profile_id', '=', 'florence.profiles.id').where({ 'florence.profiles_users_join.user_id': obj.id }).select('florence.profiles.*');
            }
        }
    };
}