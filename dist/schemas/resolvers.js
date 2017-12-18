'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeResolvers = makeResolvers;
function makeResolvers(db) {
    return {
        Query: {
            users: (root, args) => db('florence.users').select('*'),
            profiles: (root, args) => db('florence.profiles').select('*'),
            node: async (root, args) => {
                const type = await db('florence.type_lookup').where({ id: args.id }).select('type');
                return db(`florence.${type[0].type}`).where({ id: args.id }).select('*');
            }
        }
    };
}