'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProfileModel = undefined;

var _load = require('./load');

var _model = require('./model');

class ProfileModel extends _model.Model {}
exports.ProfileModel = ProfileModel;
ProfileModel.opts = {
    schema: (0, _load.loadSchema)('profiles.graphql'),
    table: 'florence.profiles',
    name: 'Profile',
    pluralName: 'profiles',
    lowerName: 'profile',
    joins: {
        users: {
            joinTable: 'florence.profiles_users_join',
            thisField: 'profile_id',
            thatField: 'user_id',
            thatName: 'User'
        }
    }
};