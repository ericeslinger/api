'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserModel = undefined;

var _load = require('./load');

var _model = require('./model');

class UserModel extends _model.Model {}
exports.UserModel = UserModel;
UserModel.opts = {
    schema: (0, _load.loadSchema)('users.graphql'),
    table: 'florence.users',
    name: 'User',
    pluralName: 'users',
    lowerName: 'user',
    joins: {
        profiles: {
            joinTable: 'florence.profiles_users_join',
            thisField: 'user_id',
            thatField: 'profile_id',
            thatName: 'Profile'
        }
    }
};