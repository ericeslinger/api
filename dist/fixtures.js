'use strict';

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _ulid = require('ulid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.on('unhandledRejection', r => console.log(r));
const client = (0, _knex2.default)({
    client: 'pg',
    connection: {
        database: 'florence',
        user: 'flo',
        host: 'localhost',
        port: 5432,
        password: 'fumfum'
    }
});
async function buildUsers() {
    return await client('florence.users').insert([{
        id: (0, _ulid.ulid)(),
        name: 'user one'
    }, {
        id: (0, _ulid.ulid)(),
        name: 'user two'
    }, {
        id: (0, _ulid.ulid)(),
        name: 'user three'
    }, {
        id: (0, _ulid.ulid)(),
        name: 'user four'
    }]).returning('id');
}
async function buildProfiles(ids) {
    const profiles = await client('florence.profiles').insert([{
        id: (0, _ulid.ulid)(),
        name: 'profile one'
    }, {
        id: (0, _ulid.ulid)(),
        name: 'profile two'
    }, {
        id: (0, _ulid.ulid)(),
        name: 'profile three'
    }, {
        id: (0, _ulid.ulid)(),
        name: 'profile four'
    }]).returning('id');
    return await client('florence.profiles_users_join').insert(profiles.map((profile, idx) => ({
        profile_id: profile,
        user_id: ids[idx]
    }))).returning('*');
}
(async () => {
    const stuff = await buildProfiles((await buildUsers()));
    console.log(JSON.stringify(stuff));
})();