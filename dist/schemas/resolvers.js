'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeResolvers = makeResolvers;
function makeResolvers(db) {
    return {
        Query: {
            profiles: (obj, args, context, info) => {
                console.log(JSON.stringify(info.fieldNodes.map(v => v.selectionSet.selections.map(i => i.name.value)), null, 2));
                return db('florence.profiles').select('*');
            },
            node: async (root, args) => {
                const type = await db('florence.type_lookup').where({ id: args.id }).select('type');
                return db(`florence.${type[0].type}`).where({ id: args.id }).select('*');
            }
        }
    };
}